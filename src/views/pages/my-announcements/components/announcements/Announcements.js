import React from 'react'
import { CButton, CCard, CCol, CRow, CImage } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil, cilPlus } from '@coreui/icons'
import './Announcements.css'
import { useNavigate } from 'react-router-dom'

const Announcements = () => {
  const navigate = useNavigate()

  const produtos = [
    {
      id: 1,
      titulo: 'Playstation 5 Pro',
      valor: '2900',
      imagem:
        'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    },
    {
      id: 2,
      titulo: 'Xbox Series X',
      valor: '2700',
      imagem:
        'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    },
    {
      id: 3,
      titulo: 'Notebook Gamer Lenovo',
      valor: '5200',
      imagem:
        'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    },
    {
      id: 4,
      titulo: 'TV 4K Samsung 55"',
      valor: '2600',
      imagem:
        'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    },
    {
      id: 5,
      titulo: 'Cadeira Gamer ThunderX3',
      valor: '1100',
      imagem:
        'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    },
    {
      id: 6,
      titulo: 'Secadora de roupa',
      valor: '420',
      imagem:
        'https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90',
    },
  ]

  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '1000px', width: '100%' }}>
          <CRow>
            <CCol md={9}>
              <h1 style={{ marginBottom: '2rem', marginTop: '3rem' }}>Meus Anúncios</h1>
            </CCol>

            <CCol md={3}>
              <CButton
                size="m"
                className="add-style"
                onClick={() => navigate('/announcement-input')}
              >
                <CIcon size="lg" icon={cilPlus} className="me-2" />
                Novo Anúncio
              </CButton>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol md={4} className="header-style">
              Imagem do Produto
            </CCol>
            <CCol md={4} className="header-style">
              Valor de interesse
            </CCol>
            <CCol md={4} className="header-style">
              Ações
            </CCol>
          </CRow>

          {produtos.map((produto) => (
            <div key={produto.id}>
              <CRow className="mt-4 align-items-center">
                <CCol md={4} className="cell-style">
                  <CImage src={produto.imagem} alt={produto.titulo} width={170} height="auto" />
                </CCol>
                <CCol md={4} className="cell-style">
                  R$ {produto.valor}
                </CCol>
                <CCol md={4} className="cell-style">
                  <CButton size="m" className="me-2">
                    <CIcon size="lg" icon={cilPencil} className="me-2" />
                    Editar
                  </CButton>
                  <CButton size="m">
                    <CIcon
                      size="lg"
                      icon={cilTrash}
                      className="me-2"
                      style={{ '--ci-primary-color': 'red' }}
                    />
                    Excluir
                  </CButton>
                </CCol>
              </CRow>

              <div style={{ borderTop: '2px solid #2E323D', margin: '20px 0' }}></div>
            </div>
          ))}
        </div>
      </CCard>
    </div>
  )
}

export default Announcements
