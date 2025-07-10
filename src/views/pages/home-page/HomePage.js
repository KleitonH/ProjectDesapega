import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CButton,
  CCardSubtitle,
  CCardText,
} from '@coreui/react'
import './HomePage.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  auth,
  db,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'src/firebase/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

const HomePage = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const [status, setStatus] = useState({})
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [priceEdits, setPriceEdits] = useState({})
  const [editingPriceId, setEditingPriceId] = useState(null)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuário autenticado:', user.uid)
        setCurrentUser(user)

        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserRole(userData.role)

            if (userData.role === 'vendedor') {
              await loadSellerInterests(user.uid)
            } else if (userData.role === 'comprador') {
              await loadBuyerProposals(user.uid)
            }
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error)
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribeAuth()
  }, [])

  // Carregar interesses para vendedores
  const loadSellerInterests = async (userId) => {
    try {
      const announcementsQuery = query(
        collection(db, 'announcements'),
        where('user_id', '==', userId),
      )

      const unsubscribe = onSnapshot(announcementsQuery, async (announcementsSnapshot) => {
        if (announcementsSnapshot.empty) {
          console.log('Nenhum anúncio encontrado para este vendedor')
          setInterests([])
          return
        }

        // Criar mapa de product_id para image_url
        const productImageMap = {}
        announcementsSnapshot.docs.forEach((doc) => {
          const data = doc.data()
          productImageMap[data.product_id] = data.image_url
        })

        const productIds = announcementsSnapshot.docs.map((doc) => doc.data().product_id)

        // Restante da lógica de busca de interesses...
        const proposalsQuery = query(collection(db, 'proposals'), where('seller_id', '==', userId))
        const proposalsSnapshot = await getDocs(proposalsQuery)
        const usedInterestIds = new Set(proposalsSnapshot.docs.map((doc) => doc.data().interest_id))

        const batchSize = 10
        let allInterests = []

        for (let i = 0; i < productIds.length; i += batchSize) {
          const batch = productIds.slice(i, i + batchSize)
          const interestsQuery = query(
            collection(db, 'interests'),
            where('product_id', 'in', batch),
            where('user_id', '!=', userId),
          )

          const interestsSnapshot = await getDocs(interestsQuery)

          allInterests = [
            ...allInterests,
            ...interestsSnapshot.docs
              .filter((doc) => !usedInterestIds.has(doc.id))
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
                originalPrice: doc.data().price,
                product_image: productImageMap[doc.data().product_id], // Adiciona a imagem do anúncio
              })),
          ]
        }

        // Buscar nomes dos produtos
        if (allInterests.length > 0) {
          const productIdsInInterests = [...new Set(allInterests.map((i) => i.product_id))]
          const productsSnapshot = await getDocs(
            query(
              collection(db, 'products'),
              where('__name__', 'in', productIdsInInterests.slice(0, 10)),
            ),
          )

          const productIdToName = {}
          productsSnapshot.forEach((doc) => {
            productIdToName[doc.id] = doc.data().name || doc.data().label || 'Produto sem nome'
          })

          allInterests = allInterests.map((interest) => ({
            ...interest,
            product_name: productIdToName[interest.product_id],
          }))
        }

        setInterests(allInterests)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Erro ao carregar interesses:', error)
      setInterests([])
    }
  }

  // Carregar propostas para compradores
  const loadBuyerProposals = async (buyerId) => {
    try {
      const proposalsQuery = query(
        collection(db, 'proposals'),
        where('buyer_id', '==', buyerId),
        where('status', '==', 'pending'),
      )

      const unsubscribe = onSnapshot(proposalsQuery, async (snapshot) => {
        const loadedProposals = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const proposalData = doc.data()

            // Buscar informações do vendedor
            let sellerName = 'Vendedor'
            try {
              const sellerDoc = await getDoc(doc(db, 'users', proposalData.seller_id))
              if (sellerDoc.exists()) {
                sellerName = sellerDoc.data().name || sellerName
              }
            } catch (error) {
              console.error('Erro ao buscar vendedor:', error)
            }

            return {
              id: doc.id,
              ...proposalData,
              seller_name: sellerName,
              type: 'proposal',
              // A imagem já deve estar incluída em proposalData.product_image
            }
          }),
        )

        setInterests(loadedProposals)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Erro ao carregar propostas:', error)
      setInterests([])
    }
  }

  // Criar proposta (para vendedores)
  const createProposal = async (interest) => {
    try {
      const finalPrice = parseFloat(interest.price) || 0

      const proposalData = {
        seller_id: currentUser.uid,
        buyer_id: interest.user_id,
        interest_id: interest.id,
        price: finalPrice,
        original_price: interest.originalPrice || interest.price,
        product_id: interest.product_id,
        product_name: interest.product_name || 'Produto sem nome',
        product_image: interest.product_image, // Inclui a imagem do anúncio
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      }

      const newProposalRef = doc(collection(db, 'proposals'))
      await setDoc(newProposalRef, proposalData)

      console.log('Proposta criada com sucesso!')
      return true
    } catch (error) {
      console.error('Erro ao criar proposta:', error)
      return false
    }
  }

  // Criar chat e atualizar proposta (para compradores)
  const handleProposalAction = async (proposalId, action) => {
    try {
      // Atualizar status da proposta
      await setDoc(
        doc(db, 'proposals', proposalId),
        {
          status: action === 'accept' ? 'accepted' : 'refused',
          updated_at: new Date(),
        },
        { merge: true },
      )

      if (action === 'accept') {
        // Criar chat
        const proposalDoc = await getDoc(doc(db, 'proposals', proposalId))
        if (proposalDoc.exists()) {
          const proposalData = proposalDoc.data()

          const chatData = {
            buyer_id: proposalData.buyer_id,
            seller_id: proposalData.seller_id,
            proposal_id: proposalId,
            price: proposalData.price,
            product_name: proposalData.product_name,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date(),
          }

          await setDoc(doc(collection(db, 'chats')), chatData)
          console.log('Chat criado com sucesso!')
        }
      }

      return true
    } catch (error) {
      console.error(`Erro ao ${action === 'accept' ? 'aceitar' : 'recusar'} proposta:`, error)
      return false
    }
  }

  const handleAction = async (type, currentItem) => {
    if (!currentItem) return

    setStatus((prev) => ({ ...prev, [currentItem.id]: type }))
    setDirection(type === 'accept' ? 'up' : 'down')

    try {
      if (type === 'accept') {
        if (userRole === 'vendedor') {
          const finalPrice =
            priceEdits[currentItem.id] !== undefined
              ? priceEdits[currentItem.id] === ''
                ? currentItem.price
                : priceEdits[currentItem.id]
              : currentItem.price

          await createProposal({
            ...currentItem,
            price: parseFloat(finalPrice) || 0,
          })
        } else if (userRole === 'comprador') {
          await handleProposalAction(currentItem.id, 'accept')
        }
      } else if (type === 'reject' && userRole === 'comprador') {
        await handleProposalAction(currentItem.id, 'refuse')
      }
    } catch (error) {
      console.error('Erro ao processar ação:', error)
    }

    setTimeout(() => {
      if (index < interests.length - 1) {
        setIndex(index + 1)
        setDirection(null)
        setEditingPriceId(null)
      } else {
        setIndex(index + 1)
      }
    }, 300)
  }

  const handleWheel = (e) => {
    if (!interests[index]) return

    if (e.deltaY < 0) {
      handleAction('accept', interests[index])
    } else if (e.deltaY > 0) {
      handleAction('reject', interests[index])
    }
  }

  // Variantes de animação
  const cardVariants = {
    initial: { y: 0, opacity: 1 },
    exitUp: { y: -400, opacity: 0, transition: { duration: 0.2 } },
    exitDown: { y: 400, opacity: 0, transition: { duration: 0.3 } },
    enter: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  }

  if (loading) {
    return (
      <CContainer
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ height: '70vh' }}
      >
        <div className="text-center">
          <h2>Carregando...</h2>
        </div>
      </CContainer>
    )
  }

  if (!userRole) {
    return (
      <CContainer
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ height: '70vh' }}
      >
        <div className="text-center">
          <h2>Bem-vindo!</h2>
          <p>Por favor, faça login para continuar.</p>
        </div>
      </CContainer>
    )
  }

  if (index >= interests.length) {
    return (
      <CContainer
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ height: '70vh' }}
      >
        <div className="text-center">
          <h2>{userRole === 'vendedor' ? 'Sem interesses' : 'Sem propostas'}</h2>
          <p>Você avaliou todos os itens disponíveis</p>
        </div>
      </CContainer>
    )
  }

  const current = interests[index]
  const next = interests[index + 1]

  return (
    <CContainer
      className={`py-4 d-flex justify-content-center align-items-center ${userRole === 'comprador' ? 'buyer-container' : ''}`}
      onWheel={handleWheel}
      style={{ maxHeight: '70vh', height: '70vh' }}
    >
      <CRow className="align-items-center w-100">
        {/* Esquerda - Descrição */}
        <CCol md={3}>
          <CCard className={`card-descricao ${userRole === 'comprador' ? 'buyer-card' : ''}`}>
            <CCardBody className="card-descricao-body">
              <CCardTitle className="card-title">{current?.product_name || 'Produto'}</CCardTitle>

              {userRole === 'comprador' && (
                <CCardSubtitle className="seller-info">
                  Vendido por: {current?.seller_name || 'Vendedor'}
                </CCardSubtitle>
              )}

              <CCardText className="price-display">
                {userRole === 'comprador' &&
                current.original_price &&
                current.original_price !== current.price ? (
                  <>
                    <div className="original-price">
                      <s>
                        R${' '}
                        {current.original_price.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </s>
                    </div>
                    <div className="current-price">
                      R${' '}
                      {current.price.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </>
                ) : (
                  <div className="single-price">
                    R${' '}
                    {current.price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                )}
              </CCardText>

              {userRole === 'vendedor' && (
                <CCardText
                  className="card-price"
                  onClick={() => {
                    setEditingPriceId(current.id)
                    // Inicializa com o preço atual se não foi editado antes
                    if (priceEdits[current.id] === undefined) {
                      setPriceEdits((prev) => ({ ...prev, [current.id]: current.price }))
                    }
                  }}
                >
                  {editingPriceId === current.id ? (
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={priceEdits[current.id] ?? current.price}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || /^[1-9]\d*(\.\d{0,2})?$|^0(\.\d{0,2})?$/.test(value)) {
                          const newValue = value === '' ? '' : parseFloat(value)
                          setPriceEdits((prev) => ({
                            ...prev,
                            [current.id]: isNaN(newValue) ? '' : newValue,
                          }))
                        }
                      }}
                      onBlur={() => {
                        if (priceEdits[current.id] === '' || priceEdits[current.id] <= 0) {
                          setPriceEdits((prev) => {
                            const newState = { ...prev }
                            delete newState[current.id]
                            return newState
                          })
                        }
                        setEditingPriceId(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (priceEdits[current.id] <= 0) {
                            setPriceEdits((prev) => {
                              const newState = { ...prev }
                              delete newState[current.id]
                              return newState
                            })
                          }
                          setEditingPriceId(null)
                        }
                      }}
                      autoFocus
                      className="price-input"
                    />
                  ) : (
                    `R$ ${(priceEdits[current.id] ?? current.price).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  )}
                </CCardText>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Centro - Imagem atual e botões */}
        <CCol md={6} className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id}
              initial="initial"
              animate="enter"
              exit={direction === 'up' ? 'exitUp' : 'exitDown'}
              variants={cardVariants}
            >
              <CCard className={`card-atual ${userRole === 'comprador' ? 'buyer-card' : ''}`}>
                <CCardImage
                  orientation="top"
                  src={current?.product_image || 'https://via.placeholder.com/300'}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <CCardBody>
                  <div className="d-flex justify-content-center gap-5 mt-3">
                    <CButton
                      color="success"
                      variant="outline"
                      className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '50px', height: '50px' }}
                      onClick={() => handleAction('accept', current)}
                    >
                      ✔️
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '50px', height: '50px' }}
                      onClick={() => handleAction('reject', current)}
                    >
                      ❌
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </motion.div>
          </AnimatePresence>
        </CCol>

        {/* Direita - Próximo item */}
        <CCol md={3}>
          {next && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CCard className={`card-proximo ${userRole === 'comprador' ? 'buyer-card' : ''}`}>
                <CCardImage
                  orientation="top"
                  src={next?.product_image || 'https://via.placeholder.com/300'}
                />
                <CCardBody>
                  <CCardTitle>{next?.product_name || 'Próximo produto'}</CCardTitle>
                </CCardBody>
              </CCard>
            </motion.div>
          )}
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default HomePage
