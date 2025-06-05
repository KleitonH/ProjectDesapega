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
import { motion } from 'framer-motion'

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
    descricao:
      'Descrição do cliente: Tem que estar em perfeitas condições, quase seminovo',
    imagem:
      'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    preco: 'R$1300',
  },
]

const HomePage = () => {
  const [index, setIndex] = useState(0)

  const handleAction = (type) => {
    if (index < produtos.length - 1) {
      setIndex(index + 1)
    }
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
          <motion.div
            key={current?.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
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
        </CCol>

        {/* Direita - Próximo item */}
        <CCol md={3}>
          {next && (
            <CCard className="card-proximo">
              <CCardImage orientation="top" src={next?.imagem} />
              <CCardBody>
                <CCardTitle>{next?.nome}</CCardTitle>
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default HomePage
