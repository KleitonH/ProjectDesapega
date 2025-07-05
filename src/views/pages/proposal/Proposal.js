import React from 'react'
import {
  CButton,
  CCard,
  CCol,
  CRow,
  CImage,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil, cilPlus } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import './Proposal.css'

const Proposal = () => {
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
          <CCol md={9}>
            <h2 style={{ marginBottom: '2rem', marginTop: '3rem' }}>Propostas Enviadas</h2>
          </CCol>

          <CRow>
            {produtos.map((produto) => (
              <CCol key={produto.id} className="mt-4 align-items-center">
                <CCard
                  style={{
                    backgroundColor: '#3A4458',
                    width: '15rem',
                    height: '22rem',
                    textAlign: 'center',
                    marginBottom: '2rem',
                  }}
                >
                  <CCardBody style={{ position: 'relative' }}>
                    <h5>{produto.titulo}</h5>
                  </CCardBody>
                  <CCardImage className="image-style" src={produto.imagem} />
                  <CCardBody>
                    <CRow className="align-items-center d-flex justify-content-between">
                      <CCol md={8}>
                        <h2 style={{ paddingTop: '15px' }}>R$ {produto.valor}</h2>
                      </CCol>
                      <CCol md={4}>
                        <CButton size="m" className="button-style">
                          <CIcon
                            size="xl"
                            icon={cilTrash}
                            className="me-2"
                            style={{
                              '--ci-primary-color': 'red',
                              marginLeft: '8px',
                            }}
                          />
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </div>
      </CCard>
    </div>
  )
}

export default Proposal
