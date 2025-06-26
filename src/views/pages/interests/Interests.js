import React from 'react'
import { CButton, CCard, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil } from '@coreui/icons'
import './Interests.css'

const Interests = () => {
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
          <h1 style={{ marginBottom: '3rem', marginTop: '1rem', textAlign: 'center' }}>
            Meus Interesses
          </h1>

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
                  <CButton size="m" color="info" className="me-2">
                    <CIcon size="lg" icon={cilPencil} className="me-2" />
                    Editar
                  </CButton>
                  <CButton size="m" color="danger">
                    <CIcon size="lg" icon={cilTrash} className="me-2" />
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
