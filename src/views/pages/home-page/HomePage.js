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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuário autenticado:', user.uid)
        setCurrentUser(user)

        try {
          // Buscar dados do usuário usando UID como ID do documento (mais eficiente)
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)

          console.log('Documento do usuário:', {
            exists: userDoc.exists(),
            data: userDoc.exists() ? userDoc.data() : null,
          })

          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log('Dados do usuário encontrado:', userData)

            if (userData.role) {
              setUserRole(userData.role)
              console.log('Role definida:', userData.role)

              if (userData.role === 'vendedor') {
                console.log('Carregando interesses para vendedor...')
                await loadSellerInterests(user.uid)
              }
            } else {
              console.warn('Usuário não possui campo "role" definido')
            }
          } else {
            console.warn('Nenhum documento de usuário encontrado para o UID:', user.uid)
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error)
        }
      } else {
        console.log('Nenhum usuário autenticado')
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribeAuth()
  }, [])

  // Carregar interesses para vendedores com listener em tempo real
  const loadSellerInterests = async (userId) => {
    try {
      // 1. Buscar anúncios do vendedor
      const announcementsQuery = query(
        collection(db, 'announcements'),
        where('user_id', '==', userId),
      )

      const unsubscribeAnnouncements = onSnapshot(
        announcementsQuery,
        async (announcementsSnapshot) => {
          if (announcementsSnapshot.empty) {
            console.log('Nenhum anúncio encontrado para este vendedor')
            setInterests([])
            return
          }

          // 2. Pegar product_ids dos anúncios
          const productIds = announcementsSnapshot.docs.map((doc) => doc.data().product_id)

          if (productIds.length === 0) {
            console.log('Nenhum product_id encontrado nos anúncios')
            setInterests([])
            return
          }

          // 3. Buscar TODAS as propostas deste vendedor
          const proposalsQuery = query(
            collection(db, 'proposals'),
            where('seller_id', '==', userId),
          )
          const proposalsSnapshot = await getDocs(proposalsQuery)

          // Criar um Set com os interestIds já utilizados
          const usedInterestIds = new Set(
            proposalsSnapshot.docs.map((doc) => doc.data().interest_id),
          )

          // 4. Buscar interesses em lotes
          const batchSize = 10
          let allInterests = []

          for (let i = 0; i < productIds.length; i += batchSize) {
            const batch = productIds.slice(i, i + batchSize)

            // Primeiro busca todos os interesses possíveis
            const interestsQuery = query(
              collection(db, 'interests'),
              where('product_id', 'in', batch),
              where('user_id', '!=', userId),
            )

            const interestsSnapshot = await getDocs(interestsQuery)

            // Filtrar localmente para verificar os interestIds
            const filteredInterests = interestsSnapshot.docs
              .filter((doc) => !usedInterestIds.has(doc.id)) // Filtra interesses já usados
              .map((doc) => {
                const interestData = doc.data()
                return {
                  id: doc.id,
                  ...interestData,
                }
              })

            allInterests = [...allInterests, ...filteredInterests]
          }

          // 5. Buscar nomes dos produtos para os interesses filtrados
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

            // Adicionar os nomes aos interesses
            allInterests = allInterests.map((interest) => ({
              ...interest,
              product_name: productIdToName[interest.product_id],
            }))
          }

          console.log('Interesses filtrados:', allInterests)
          setInterests(allInterests)
        },
      )

      return () => unsubscribeAnnouncements()
    } catch (error) {
      console.error('Erro ao carregar interesses:', error)
      setInterests([])
    }
  }

  // Criar proposta quando o vendedor aceita
  const createProposal = async (interest) => {
    try {
      const proposalData = {
        seller_id: currentUser.uid,
        buyer_id: interest.user_id,
        interest_id: interest.id,
        price: interest.price,
        product_id: interest.product_id,
        product_name: interest.product_name || 'Produto sem nome',
        status: 'pendente',
        created_at: new Date(),
        updated_at: new Date(),
      }

      // Adicionar nova proposta à coleção
      const newProposalRef = doc(collection(db, 'proposals'))
      await setDoc(newProposalRef, proposalData)

      console.log('Proposta criada com sucesso! ID:', newProposalRef.id)
    } catch (error) {
      console.error('Erro ao criar proposta:', error)
    }
  }

  const handleAction = async (type, currentInterest) => {
    if (!currentInterest) return

    // Salva o status do item atual
    setStatus((prev) => ({ ...prev, [currentInterest.id]: type }))

    // Define a direção da animação
    setDirection(type === 'accept' ? 'up' : 'down')

    // Se aceitou, criar proposta
    if (type === 'accept') {
      await createProposal(currentInterest)
    }

    // Avança para o próximo item após um pequeno delay para a animação
    setTimeout(() => {
      if (index < interests.length - 1) {
        setIndex(index + 1)
        setDirection(null)
      } else {
        setIndex(index + 1) // Para mostrar a mensagem final
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

  if (userRole !== 'vendedor') {
    return (
      <CContainer
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ height: '70vh' }}
      >
        <div className="text-center">
          <h2>Bem-vindo!</h2>
          <p>Esta página é apenas para vendedores.</p>
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
          <h2>Sem interesses</h2>
          <p>Você avaliou todos os itens disponíveis</p>
        </div>
      </CContainer>
    )
  }

  const current = interests[index]
  const next = interests[index + 1]

  return (
    <CContainer
      className="py-4 d-flex justify-content-center align-items-center"
      onWheel={handleWheel}
      style={{ maxHeight: '70vh', height: '70vh' }}
    >
      <CRow className="align-items-center w-100">
        {/* Esquerda - Descrição */}
        <CCol md={3}>
          <CCard className="card-descricao">
            <CCardBody className="card-descricao-body">
              <CCardTitle className="card-title">{current?.product_name || 'Produto'}</CCardTitle>
              <CCardSubtitle className="card-subtitle">
                {current?.description || 'Sem descrição'}
              </CCardSubtitle>
              <CCardText className="card-price">R$ {current?.price || '0'}</CCardText>
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
              <CCard className="card-atual">
                <CCardImage
                  orientation="top"
                  src={current?.product_image || 'https://via.placeholder.com/300'}
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
              <CCard className="card-proximo">
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
