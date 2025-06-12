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
import { cilLockLocked, cilUser, cibGoogle, cibFacebook } from '@coreui/icons'

const Login = () => {
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
              <h1 style={{ color: '#0474BA', marginBottom: '3rem' }}>Login</h1>
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
            </CForm>
            <CButton
              style={{ backgroundColor: '#E88011', color: '#0474BA', fontSize: '1rem' }}
              className="px-4"
            >
              Entrar
            </CButton>
            <Link
              to="/register"
              style={{ textDecoration: 'none', color: 'black', textAlign: 'initial' }}
            >
              <p>Não possui uma conta? Cadastre-se</p>
            </Link>
            <br />
            <div>
              <h4 style={{ color: '#0474BA', marginBottom: ' 1rem' }}>Entrar com</h4>
              <Link to="https://www.facebook.com/?locale=pt_BR">
                <CIcon
                  icon={cibFacebook}
                  size="xl"
                  style={{ marginRight: '1.2rem', color: 'black' }}
                />
              </Link>
              <Link to="https://www.google.com/webhp?hl=pt-BR&sa=X&ved=0ahUKEwjm2oTh5bWNAxVzq5UCHU56LmMQPAgI">
                <CIcon icon={cibGoogle} size="xl" style={{ color: 'black' }} />
              </Link>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Login
