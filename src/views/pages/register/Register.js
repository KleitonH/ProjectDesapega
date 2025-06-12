import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CImage,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilCalendar, cilAt } from '@coreui/icons'

const Register = () => {
  return (
    <div className="container-fluid">
      <CRow className="min-vh-100 ">
        <CCol
          className="d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: '#0474BA',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <CImage
            src="./src/assets/images/desapega.png"
            width={450}
            height={450}
            style={{ borderRadius: '300px' }}
          />
        </CCol>
        <CCol
          className="d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'white', textAlign: 'center' }}
        >
          <CCard style={{ backgroundColor: 'white', width: '60%' }}>
            <CForm>
              <h1 style={{ color: '#0474BA', marginBottom: '3rem' }}>Cadastro</h1>
              <CInputGroup className="mb-3">
                <CInputGroupText
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                >
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                  placeholder="Nome Completo"
                  autoComplete="name"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                >
                  <CIcon icon={cilAt} />
                </CInputGroupText>
                <CFormInput
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                  placeholder="E-mail"
                  autoComplete="email"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                >
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                  type="password"
                  placeholder="Senha"
                  autoComplete="current-password"
                />
              </CInputGroup>
              <p style={{ color: 'black', textAlign: 'initial' }}>Data de Nascimento</p>
              <CInputGroup className="mb-3">
                <CFormInput
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                  type="date"
                  placeholder="Data de Nascimento"
                  autoComplete="date"
                />
              </CInputGroup>
            </CForm>
            <CButton
              style={{ backgroundColor: '#E88011', color: '#0474BA', fontSize: '1rem' }}
              className="px-4"
            >
              Cadastre-se
            </CButton>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Register
