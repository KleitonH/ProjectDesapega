// src/views/pages/register/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from 'src/firebase/firebaseConfig'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthday, setBirthDay] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Atualiza o nome no perfil do auth
      await updateProfile(user, { displayName: name })

      // Salva no Firestore (coleção "users", documento com ID do usuário)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        birthday,
        createdAt: new Date().toISOString(),
        role: 'comprador',
      })

      navigate('/home-page')
    } catch (err) {
      console.error('Erro no registro:', err)
      setError('Erro ao criar conta. Verifique os dados.')
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
            <CForm onSubmit={handleRegister}>
              <h1 style={{ color: '#0474BA', marginBottom: '3rem' }}>Cadastro</h1>

              <CInputGroup className="mb-3">
                <CInputGroupText style={{ backgroundColor: '#D9D9D9', color: 'black' }}>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome Completo"
                  autoComplete="name"
                  style={{ backgroundColor: '#D9D9D9', color: 'black' }}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText style={{ backgroundColor: '#D9D9D9', color: 'black' }}>
                  <CIcon icon={cilAt} />
                </CInputGroupText>
                <CFormInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  autoComplete="email"
                  style={{ backgroundColor: '#D9D9D9', color: 'black' }}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText style={{ backgroundColor: '#D9D9D9', color: 'black' }}>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  autoComplete="new-password"
                  style={{ backgroundColor: '#D9D9D9', color: 'black' }}
                />
              </CInputGroup>

              <p style={{ color: 'black', textAlign: 'initial' }}>Data de Nascimento</p>
              <CInputGroup className="mb-3">
                <CInputGroupText style={{ backgroundColor: '#D9D9D9', color: 'black' }}>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthDay(e.target.value)}
                  style={{ backgroundColor: '#D9D9D9', color: 'black' }}
                />
              </CInputGroup>

              <CButton
                type="submit"
                style={{ backgroundColor: '#E88011', color: '#0474BA', fontSize: '1rem' }}
                className="px-4"
              >
                Cadastre-se
              </CButton>

              {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            </CForm>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Register
