import React, { useState, useRef, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CButton,
  CAvatar,
  CCardTitle,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMoodGood, cilPaperclip, cilPaperPlane, cilCheckCircle, cilDollar } from '@coreui/icons'
import { db, auth, storage } from 'src/firebase/firebaseConfig'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  orderBy,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [showFinalizationModal, setShowFinalizationModal] = useState(false)
  const [finalizationAmount, setFinalizationAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [usersData, setUsersData] = useState({}) // Armazena dados dos usuários
  const [loadingUsers, setLoadingUsers] = useState(true)

  const scrollRef = useRef(null)
  const fileInputRef = useRef(null)

  // Busca os dados do usuário pelo ID
  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      return userDoc.exists() ? userDoc.data() : null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  useEffect(() => {
    if (!auth.currentUser) return

    const unsubscribeChats = onSnapshot(
      query(collection(db, 'chats'), where('buyer_id', '==', auth.currentUser.uid)),
      async (querySnapshot) => {
        const chatsData = []
        const usersToFetch = new Set()

        // Primeiro buscamos os chats onde o usuário é o comprador
        querySnapshot.forEach((doc) => {
          const chatData = { id: doc.id, ...doc.data() }
          chatsData.push(chatData)
          usersToFetch.add(chatData.seller_id) // Adiciona o vendedor para buscar dados
        })

        // Depois buscamos os chats onde o usuário é o vendedor
        const sellerQuery = query(
          collection(db, 'chats'),
          where('seller_id', '==', auth.currentUser.uid),
        )

        const unsubscribeSeller = onSnapshot(sellerQuery, async (sellerSnapshot) => {
          sellerSnapshot.forEach((doc) => {
            const chatData = { id: doc.id, ...doc.data() }
            chatsData.push(chatData)
            usersToFetch.add(chatData.buyer_id) // Adiciona o comprador para buscar dados
          })

          // Busca os dados de todos os usuários envolvidos
          const usersDataPromises = Array.from(usersToFetch).map(async (userId) => {
            const userData = await fetchUserData(userId)
            return { userId, userData }
          })

          const usersDataResults = await Promise.all(usersDataPromises)
          const usersDataMap = usersDataResults.reduce((acc, { userId, userData }) => {
            if (userData) acc[userId] = userData
            return acc
          }, {})

          setUsersData(usersDataMap)
          setChats(chatsData)
          setLoadingUsers(false)

          // Seleciona o primeiro chat se nenhum estiver selecionado
          if (chatsData.length > 0 && !selectedChat) {
            setSelectedChat(chatsData[0])
          }
        })

        return () => unsubscribeSeller()
      },
      (error) => {
        console.error('Error listening to chats:', error)
        setLoadingUsers(false)
      },
    )

    return () => unsubscribeChats()
  }, [auth.currentUser])

  useEffect(() => {
    if (!selectedChat) return

    try {
      const q = query(
        collection(db, 'messages'),
        where('chat_id', '==', selectedChat.id),
        orderBy('created_at', 'asc'),
      )

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const messagesData = []
          querySnapshot.forEach((doc) => {
            messagesData.push({ id: doc.id, ...doc.data() })
          })
          setMessages(messagesData)
        },
        (error) => {
          console.error('Error getting messages:', error)
          // Fallback para query sem ordenação se o índice não estiver pronto
          if (error.code === 'failed-precondition') {
            const fallbackQ = query(
              collection(db, 'messages'),
              where('chat_id', '==', selectedChat.id),
            )
            onSnapshot(fallbackQ, (snapshot) => {
              const messagesData = []
              snapshot.forEach((doc) => {
                messagesData.push({ id: doc.id, ...doc.data() })
              })
              messagesData.sort((a, b) => a.created_at?.toMillis() - b.created_at?.toMillis())
              setMessages(messagesData)
            })
          }
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error('Error setting up messages listener:', error)
    }
  }, [selectedChat])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getOtherUserData = (chat) => {
    if (!auth.currentUser || !usersData) return { name: 'Usuário', avatar: null }

    const otherUserId = chat.buyer_id === auth.currentUser.uid ? chat.seller_id : chat.buyer_id
    const userData = usersData[otherUserId] || {}

    return {
      name: userData.name || (chat.buyer_id === auth.currentUser.uid ? 'Vendedor' : 'Comprador'),
      avatar: userData.avatar || null,
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedChat || !auth.currentUser) return

    try {
      await addDoc(collection(db, 'messages'), {
        chat_id: selectedChat.id,
        content: inputValue,
        sender_id: auth.currentUser.uid,
        created_at: new Date(),
        type: 'text',
      })
      setInputValue('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleSendImage = async () => {
    if (!imageFile || !selectedChat || !auth.currentUser) return

    setLoading(true)
    try {
      const storageRef = ref(
        storage,
        `chat_images/${selectedChat.id}/${Date.now()}_${imageFile.name}`,
      )
      await uploadBytes(storageRef, imageFile)
      const imageUrl = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'messages'), {
        chat_id: selectedChat.id,
        image_url: imageUrl,
        sender_id: auth.currentUser.uid,
        created_at: new Date(),
        type: 'image',
      })

      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error sending image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleFinalization = async () => {
    if (!finalizationAmount || !selectedChat || !auth.currentUser) return

    try {
      await addDoc(collection(db, 'messages'), {
        chat_id: selectedChat.id,
        content: `Finalização proposta: R$ ${finalizationAmount}`,
        sender_id: auth.currentUser.uid,
        created_at: new Date(),
        type: 'finalization',
        amount: parseFloat(finalizationAmount),
        status: 'pending',
      })

      setFinalizationAmount('')
      setShowFinalizationModal(false)
    } catch (error) {
      console.error('Error sending finalization:', error)
    }
  }

  const handleAcceptFinalization = async (messageId) => {
    if (!selectedChat || !auth.currentUser) return

    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: 'accepted',
      })

      if (selectedChat.proposal_id) {
        await updateDoc(doc(db, 'proposals', selectedChat.proposal_id), {
          status: 'finished',
        })
      }
    } catch (error) {
      console.error('Error accepting finalization:', error)
    }
  }

  return (
    <CContainer
      fluid
      className="overflow-hidden rounded"
      style={{ maxHeight: '80vh', height: '80vh' }}
    >
      <CRow className="h-100">
        {/* Contacts Column */}
        <CCol md={4} className="border-end p-0 d-flex flex-column" style={{ height: '100%' }}>
          <div className="p-3 d-flex border-bottom bg-dark">
            <h4 className="text-white my-auto">Conversas</h4>
          </div>

          <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
            {loadingUsers ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <CSpinner color="primary" />
              </div>
            ) : chats.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <p>Nenhuma conversa encontrada</p>
              </div>
            ) : (
              chats.map((chat) => {
                const otherUser = getOtherUserData(chat)
                return (
                  <CCard
                    key={chat.id}
                    className="m-2"
                    onClick={() => setSelectedChat(chat)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CCardBody className="d-flex align-items-center">
                      <CAvatar src={otherUser.avatar} className="me-3" />
                      <div>
                        <strong>{otherUser.name}</strong>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>
                          {chat.last_message || 'Nenhuma mensagem ainda'}
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                )
              })
            )}
          </div>
        </CCol>

        {/* Chat Column */}
        <CCol md={8} className="p-0 d-flex flex-column" style={{ height: '100%' }}>
          {selectedChat ? (
            <>
              <div
                className="d-flex align-items-center gap-3 p-3 border-bottom bg-primary"
                style={{ flex: '0 0 auto' }}
              >
                <CAvatar src={getOtherUserData(selectedChat).avatar} size="md" />
                <h5 className="mb-0 text-white">{getOtherUserData(selectedChat).name}</h5>
              </div>

              <div
                ref={scrollRef}
                className="px-3 py-2 overflow-auto"
                style={{
                  flex: '1 1 auto',
                  backgroundColor: '#f8f9fa',
                  minHeight: 0,
                }}
              >
                {messages.map((msg) => {
                  const isCurrentUser = msg.sender_id === auth.currentUser?.uid
                  const senderData = isCurrentUser
                    ? {
                        name: 'Você',
                        avatar: usersData[auth.currentUser.uid]?.avatar,
                      }
                    : getOtherUserData(selectedChat)

                  return (
                    <div
                      key={msg.id}
                      className="mb-2 d-flex"
                      style={{ justifyContent: isCurrentUser ? 'flex-end' : 'flex-start' }}
                    >
                      {!isCurrentUser && (
                        <CAvatar
                          src={senderData.avatar}
                          size="sm"
                          className="me-2 align-self-end"
                        />
                      )}
                      <div
                        style={{
                          backgroundColor: isCurrentUser ? '#198754' : '#adb5bd',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '10px',
                          maxWidth: '75%',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        <strong>{senderData.name}</strong>{' '}
                        <span style={{ fontSize: '0.8em' }}>
                          {msg.created_at
                            ?.toDate()
                            ?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div>
                          {msg.type === 'image' ? (
                            <img
                              src={msg.image_url}
                              alt="Enviada no chat"
                              style={{ maxWidth: '100%', maxHeight: '200px' }}
                            />
                          ) : msg.type === 'finalization' ? (
                            <div>
                              <p>{msg.content}</p>
                              {!isCurrentUser && msg.status === 'pending' && (
                                <CButton
                                  color="success"
                                  size="sm"
                                  onClick={() => handleAcceptFinalization(msg.id)}
                                >
                                  <CIcon icon={cilCheckCircle} className="me-1" />
                                  Aceitar
                                </CButton>
                              )}
                              {msg.status === 'accepted' && (
                                <div className="text-success">
                                  <CIcon icon={cilCheckCircle} className="me-1" />
                                  Finalização aceita
                                </div>
                              )}
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                      {isCurrentUser && (
                        <CAvatar
                          src={senderData.avatar}
                          size="sm"
                          className="ms-2 align-self-end"
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              <div
                className="p-3 border-top d-flex align-items-center gap-3"
                style={{ flex: '0 0 auto', backgroundColor: 'white' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <CButton
                  color="link"
                  className="ms-2 p-2"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CIcon icon={cilPaperclip} size="xl" />
                </CButton>
                {imageFile && (
                  <CButton color="info" size="sm" onClick={handleSendImage} disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Imagem'}
                  </CButton>
                )}
                <CButton
                  color="link"
                  className="ms-2 p-2"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  onClick={() => setShowFinalizationModal(true)}
                >
                  <CIcon icon={cilDollar} size="xl" />
                </CButton>
                <CFormInput
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite uma mensagem"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <CButton
                  color="primary"
                  className="ms-2 d-flex justify-content-center align-items-center rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                  onClick={handleSendMessage}
                >
                  <CIcon icon={cilPaperPlane} size="xl" />
                </CButton>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>Selecione uma conversa ou inicie uma nova</p>
            </div>
          )}
        </CCol>
      </CRow>

      {/* Finalization Modal */}
      <CModal visible={showFinalizationModal} onClose={() => setShowFinalizationModal(false)}>
        <CModalHeader>
          <CModalTitle>Finalizar Negociação</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <label htmlFor="finalizationAmount" className="form-label">
                Valor acordado
              </label>
              <CFormInput
                type="number"
                id="finalizationAmount"
                value={finalizationAmount}
                onChange={(e) => setFinalizationAmount(e.target.value)}
                placeholder="Digite o valor"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowFinalizationModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleFinalization}>
            Enviar Proposta
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default ChatPage
