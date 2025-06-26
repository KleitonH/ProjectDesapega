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
} from '@coreui/react'
import avatar8 from '../../../assets/images/avatars/8.jpg'
import CIcon from '@coreui/icons-react'
import { cilMoodGood, cilPaperclip, cilPaperPlane } from '@coreui/icons'

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectedUser, setSelectedUser] = useState('Maicon')

  const scrollRef = useRef(null)

  // Mock de mensagens por usuário
  const mockMessages = {
    Vanessa: [
      {
        sender: 'Vanessa',
        text: 'Olá! Gostaria de saber se é possível alterar a entrega?',
        time: '10:20',
      },
    ],
    Maicon: [
      { sender: 'Maicon', text: 'Boa tarde amigo', time: '17:45' },
      { sender: 'Você', text: 'Manda foto da máquina', time: '17:48' },
      { sender: 'Maicon', text: '[Foto do PS5]', time: '17:56' },
      { sender: 'Você', text: 'Finalizar venda?\nR$ 2800,00', time: '18:09' },
    ],
    Suzana: [{ sender: 'Suzana', text: 'Tá bem então...', time: '15:00' }],
    Lucas: [{ sender: 'Lucas', text: 'Fico no aguardo, obrigado!', time: '11:34' }],
    Alexandre: [{ sender: 'Alexandre', text: 'Poderia dizer se tem garantia?', time: '12:00' }],
    Jefferson: [
      {
        sender: 'Jefferson',
        text: 'Olá! Gostaria de saber se é possível alterar...',
        time: '13:00',
      },
    ],
    Joana: [
      {
        sender: 'Jefferson',
        text: 'Olá! Gostaria de saber se é possível alterar...',
        time: '13:00',
      },
    ],
    Lindovina: [
      {
        sender: 'Jefferson',
        text: 'Olá! Gostaria de saber se é possível alterar...',
        time: '13:00',
      },
    ],
    Anastacio: [
      {
        sender: 'Jefferson',
        text: 'Olá! Gostaria de saber se é possível alterar...',
        time: '13:00',
      },
    ],
  }

  const users = Object.keys(mockMessages).map((name) => ({
    name,
    preview: mockMessages[name][0]?.text || '',
  }))

  const [messages, setMessages] = useState(mockMessages[selectedUser] || [])

  useEffect(() => {
    // Quando trocar o usuário, atualiza a conversa
    setMessages(mockMessages[selectedUser] || [])
  }, [selectedUser])

  useEffect(() => {
    // Faz rolagem automática para a última mensagem
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMessage = { sender: 'Você', text: inputValue, time }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')
  }

  return (
    <CContainer
      fluid
      className="overflow-hidden rounded"
      style={{ maxHeight: '80vh', height: '80vh' }}
    >
      <CRow className="h-100">
        {/* Coluna de Contatos */}
        <CCol md={4} className="border-end p-0 d-flex flex-column" style={{ height: '100%' }}>
          {/* Título fixo */}
          <div className="p-3 d-flex border-bottom bg-dark">
            <h4 className='text-white my-auto'>Contatos</h4>
          </div>

          {/* Lista rolável */}
          <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
            {users.map((user, index) => (
              <CCard
                key={index}
                className="m-2"
                onClick={() => setSelectedUser(user.name)}
                style={{ cursor: 'pointer' }}
              >
                <CCardBody>
                  <strong>{user.name}</strong>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>{user.preview}</div>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </CCol>

        {/* Coluna da Conversa */}
        <CCol md={8} className="p-0 d-flex flex-column" style={{ height: '100%' }}>
          {/* Cabeçalho fixo */}
          <div
            className="d-flex align-items-center gap-3 p-3 border-bottom bg-primary"
            style={{ flex: '0 0 auto' }}
          >
            <CAvatar src={avatar8} size="md" />
            <h5 className="mb-0">{selectedUser}</h5>
          </div>

          {/* Container de mensagens */}
          <div
            ref={scrollRef}
            className="px-3 py-2 overflow-auto"
            style={{
              flex: '1 1 auto',
              backgroundColor: '#f8f9fa',
              minHeight: 0,
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className="mb-2 d-flex"
                style={{ justifyContent: msg.sender === 'Você' ? 'flex-end' : 'flex-start' }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === 'Você' ? '#198754' : '#adb5bd',
                    color: 'white', // para contraste melhor com o verde escuro,
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '75%',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <strong>{msg.sender}</strong>{' '}
                  <span style={{ fontSize: '0.8em' }}>{msg.time}</span>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input fixo no rodapé */}
          <div
            className="p-3 border-top d-flex align-items-center gap-3"
            style={{ flex: '0 0 auto', backgroundColor: 'white' }}
          >
            <CButton
              color="link"
              className="ms-2 p-2"
              style={{ backgroundColor: 'transparent', border: 'none' }}
            >
              <CIcon icon={cilMoodGood} size="xl" />
            </CButton>
            <CButton
              color="link"
              className="ms-2 p-2"
              style={{ backgroundColor: 'transparent', border: 'none' }}
            >
              <CIcon icon={cilPaperclip} size="xl" />
            </CButton>
            <CFormInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite uma mensagem"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <CButton
              color="primary"
              className="ms-2 d-flex justify-content-center align-items-center rounded-circle"
              style={{ width: '40px', height: '40px' }}
              onClick={handleSend}
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
