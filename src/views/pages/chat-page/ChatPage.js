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
} from '@coreui/react'
import avatar8 from '../../../assets/images/avatars/8.jpg'
import CIcon from '@coreui/icons-react'
import { cilMoodGood, cilPaperclip, cilPaperPlane } from '@coreui/icons'

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../../../firebase/firebaseConfig'

const makeChatId = (userA, userB) => [userA, userB].sort().join('_')

const ChatPage = () => {
  /* -------------------------------------------------------------- */
  /* 🗂️  Estado / Refs                                             */
  /* -------------------------------------------------------------- */
  const [inputValue, setInputValue] = useState('')
  const [selectedUserUid, setSelectedUserUid] = useState(null) // UID real do contato
  const [messages, setMessages] = useState([])
  const scrollRef = useRef(null)


  const contacts = [
    { uid: 'uidMaicon', name: 'Maicon' },
    { uid: 'uidVanessa', name: 'Vanessa' },
    { uid: 'uidSuzana', name: 'Suzana' },
  ]

  /* -------------------------------------------------------------- */
  /* 🔄  Listener em tempo real                                    */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedUserUid) return // nenhum contato selecionado

    const currentUserUid = auth.currentUser?.uid
    if (!currentUserUid) return // usuário não autenticado

    const chatId = makeChatId(currentUserUid, selectedUserUid)

    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [selectedUserUid])

  /* -------------------------------------------------------------- */
  /* ↕️  Rolagem automática                                         */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  /* -------------------------------------------------------------- */
  /* ➡️  Envio de mensagem                                          */
  /* -------------------------------------------------------------- */
  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text) return

    const currentUserUid = auth.currentUser?.uid
    if (!currentUserUid || !selectedUserUid) return

    const chatId = makeChatId(currentUserUid, selectedUserUid)

    await addDoc(collection(db, 'messages'), {
      chatId,
      senderId: currentUserUid,
      receiverId: selectedUserUid,
      content: text,
      createdAt: serverTimestamp(),
      read: false,
    })

    setInputValue('')
  }

  /* -------------------------------------------------------------- */
  /*  Render                                                        */
  /* -------------------------------------------------------------- */
  return (
    <CContainer
      fluid
      className="overflow-hidden rounded"
      style={{ maxHeight: '80vh', height: '80vh' }}
    >
      <CRow className="h-100">
        {/* ------------------------------------------------------ */}
        {/* 📇  COLUNA DE CONTATOS                                 */}
        {/* ------------------------------------------------------ */}
        <CCol md={4} className="border-end p-0 d-flex flex-column" style={{ height: '100%' }}>
          <div className="p-3 d-flex border-bottom bg-dark">
            <h4 className="text-white my-auto">Contatos</h4>
          </div>

          <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
            {contacts.map((user) => (
              <CCard
                key={user.uid}
                className="m-2"
                onClick={() => setSelectedUserUid(user.uid)}
                style={{ cursor: 'pointer' }}
              >
                <CCardBody>
                  <strong>{user.name}</strong>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </CCol>

        {/* ------------------------------------------------------ */}
        {/* 💬  COLUNA DA CONVERSA                                 */}
        {/* ------------------------------------------------------ */}
        <CCol md={8} className="p-0 d-flex flex-column" style={{ height: '100%' }}>
          {/* Cabeçalho */}
          <div className="d-flex align-items-center gap-3 p-3 border-bottom bg-primary" style={{ flex: '0 0 auto' }}>
            <CAvatar src={avatar8} size="md" />
            <h5 className="mb-0">
              {contacts.find((c) => c.uid === selectedUserUid)?.name || 'Selecione um contato'}
            </h5>
          </div>

          {/* Mensagens */}
          <div
            ref={scrollRef}
            className="px-3 py-2 overflow-auto"
            style={{ flex: '1 1 auto', backgroundColor: '#f8f9fa', minHeight: 0 }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="mb-2 d-flex"
                style={{ justifyContent: msg.senderId === auth.currentUser?.uid ? 'flex-end' : 'flex-start' }}
              >
                <div
                  style={{
                    backgroundColor: msg.senderId === auth.currentUser?.uid ? '#198754' : '#adb5bd',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '75%',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <span style={{ fontSize: '0.8em' }}>
                    {msg.createdAt?.seconds
                      ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      : '--:--'}
                  </span>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input de envio */}
          <div className="p-3 border-top d-flex align-items-center gap-3" style={{ flex: '0 0 auto', backgroundColor: 'white' }}>
            <CButton color="link" className="ms-2 p-2" style={{ backgroundColor: 'transparent' }}>
              <CIcon icon={cilMoodGood} size="xl" />
            </CButton>
            <CButton color="link" className="ms-2 p-2" style={{ backgroundColor: 'transparent' }}>
              <CIcon icon={cilPaperclip} size="xl" />
            </CButton>
            <CFormInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite uma mensagem"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={!selectedUserUid}
            />
            <CButton
              color="primary"
              className="ms-2 d-flex justify-content-center align-items-center rounded-circle"
              style={{ width: '40px', height: '40px' }}
              onClick={handleSend}
              disabled={!selectedUserUid}
            >
              <CIcon icon={cilPaperPlane} size="xl" />
            </CButton>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ChatPage
