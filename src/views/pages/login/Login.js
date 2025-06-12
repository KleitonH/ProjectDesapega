import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'src/firebase/firebaseConfig'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/home-page') // redireciona para sua HomePage.js
    } catch (err) {
      setError('Email ou senha inválidos.')
    }
  }

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
          <CCard style={{ backgroundColor: 'white', width: '60%' }} className="p-4">
            <CForm onSubmit={handleLogin}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    marginBottom: '15px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                  }}
                  placeholder="Senha"
                  autoComplete="current-password"
                />
              </CInputGroup>

              <CButton
                type="submit"
                style={{ backgroundColor: '#E88011', color: '#0474BA', fontSize: '1rem' }}
                className="px-4"
              >
                Entrar
              </CButton>

              {error && (
                <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
              )}

              <Link
                to="/register"
                style={{ textDecoration: 'none', color: 'black', textAlign: 'initial', marginTop: '1rem' }}
              >
                <p>Não possui uma conta? Cadastre-se</p>
              </Link>

              <div>
                <h4 style={{ color: '#0474BA', marginBottom: '1rem' }}>Entrar com</h4>
                <Link to="#">
                  <CIcon
                    icon={cibFacebook}
                    size="xl"
                    style={{ marginRight: '1.2rem', color: 'black' }}
                  />
                </Link>
                <Link to="#">
                  <CIcon icon={cibGoogle} size="xl" style={{ color: 'black' }} />
                </Link>
              </div>
            </CForm>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Login
