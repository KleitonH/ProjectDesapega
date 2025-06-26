import React, { useState } from 'react'
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

const produtos = [
  {
    id: 1,
    nome: 'Iphone XS',
    descricao:
      'Descrição do cliente: Busco um iphone Xs que esteja funcionando totalmente, pode ter pequenas avarias',
    imagem:
      'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    preco: 'R$1400',
  },
  {
    id: 2,
    nome: 'Iphone XS',
    descricao: 'Descrição do cliente: Um iphone Xs com 64gb tá ótimo',
    imagem:
      'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    preco: 'R$1500',
  },
  {
    id: 3,
    nome: 'Iphone XS',
    descricao: 'Descrição do cliente: Funcionando já tá ótimo',
    imagem:
      'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    preco: 'R$1450',
  },
  {
    id: 4,
    nome: 'Iphone XS',
    descricao: 'Descrição do cliente: Tem que estar em perfeitas condições, quase seminovo',
    imagem:
      'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    preco: 'R$1300',
  },
]

const HomePage = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(null) // 'up' ou 'down'
  const [status, setStatus] = useState({}) // {id: 'accepted' ou 'rejected'}

  const handleAction = (type) => {
    // Salva o status do item atual
    setStatus((prev) => ({ ...prev, [produtos[index].id]: type }))

    // Define a direção da animação
    setDirection(type === 'accept' ? 'up' : 'down')

    // Avança para o próximo item após um pequeno delay para a animação
    setTimeout(() => {
      if (index < produtos.length - 1) {
        setIndex(index + 1)
        setDirection(null)
      } else {
        setIndex(index + 1) // Para mostrar a mensagem final
      }
    }, 300)
  }

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      handleAction('accept')
    } else if (e.deltaY > 0) {
      handleAction('reject')
    }
  }

  const current = produtos[index]
  const next = produtos[index + 1]

  // Variantes de animação
  const cardVariants = {
    initial: { y: 0, opacity: 1 },
    exitUp: { y: -400, opacity: 0, transition: { duration: 0.2 } },
    exitDown: { y: 400, opacity: 0, transition: { duration: 0.3 } },
    enter: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  }

  if (index >= produtos.length) {
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
              <CCardTitle className="card-title">{current?.nome}</CCardTitle>
              <CCardSubtitle className="card-subtitle">{current?.descricao}</CCardSubtitle>
              <CCardText className="card-price">{current?.preco}</CCardText>
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
                <CCardImage orientation="top" src={current?.imagem} />
                <CCardBody>
                  <div className="d-flex justify-content-center gap-5 mt-3">
                    <CButton
                      color="success"
                      variant="outline"
                      className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '50px', height: '50px' }}
                      onClick={() => handleAction('accept')}
                    >
                      ✔️
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '50px', height: '50px' }}
                      onClick={() => handleAction('reject')}
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
                <CCardImage orientation="top" src={next?.imagem} />
                <CCardBody>
                  <CCardTitle>{next?.nome}</CCardTitle>
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
