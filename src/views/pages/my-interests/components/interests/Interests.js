import React from 'react'
import { CButton, CCard, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil, cilPlus } from '@coreui/icons'
import './Interests.css'
import { useNavigate } from 'react-router-dom'

const Interests = () => {
  const navigate = useNavigate()

  const produtos = [
    { id: 1, titulo: 'Playstation 5 Pro', valor: '2900' },
    { id: 2, titulo: 'Xbox Series X', valor: '2700' },
    { id: 3, titulo: 'Notebook Gamer Lenovo', valor: '5200' },
    { id: 4, titulo: 'TV 4K Samsung 55"', valor: '2600' },
    { id: 5, titulo: 'Cadeira Gamer ThunderX3', valor: '1100' },
    { id: 6, titulo: 'Secadora de roupa', valor: '420' },
  ]

  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '1000px', width: '100%' }}>
          <CRow>
            <CCol md={9}>
              <h1 style={{ marginBottom: '2rem', marginTop: '3rem' }}>Meus Interesses</h1>
            </CCol>
            <CCol md={3}>
              <CButton size="m" onClick={() => navigate('/interest-input')} className="add-style">
                <CIcon size="lg" icon={cilPlus} className="me-2" />
                Novo Interesse
              </CButton>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol md={4} className="header-style">
              Título
            </CCol>
            <CCol md={4} className="header-style">
              Valor de interesse
            </CCol>
            <CCol md={4} className="header-style">
              Ações
            </CCol>
          </CRow>

          {produtos.map((produto, index) => (
            <div key={produto.id}>
              <CRow className="mt-4">
                <CCol md={4} className="cell-style">
                  {produto.titulo}
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

export default Interests
