import React from 'react'
import { CButton, CCard, CCol, CRow, CAvatar } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilterFrames, cilTags } from '@coreui/icons'
import avatar8 from '../../../assets/images/avatars/8.jpg'
import './Profile.css'

const Profile = () => {
  const usuarioMock = {
    nome: 'Maicon Pereira',
    email: 'maiconpereira@gmail.com',
    dataNascimento: '06/08/2000',
    avatar: avatar8,
    totalAnuncios: 4,
    totalInteresses: 0,
  }

  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '850px', width: '100%' }}>
          <CRow className="mt-4">
            <CCol md={1}>
              <CAvatar src={usuarioMock.avatar} size="xl" />
            </CCol>
            <CCol md={6}>
              <h4>{usuarioMock.nome}</h4>
              <p>{usuarioMock.email}</p>
            </CCol>
          </CRow>

          <div style={{ borderTop: '2px solid rgb(150, 150, 150)', margin: '20px 0' }}></div>

          <CRow>
            <CCol md={6}>
              <h5 style={{ marginBottom: '1.5rem', marginTop: '1rem', textAlign: 'center' }}>
                Informações pessoais
              </h5>

              <p>Nome Completo</p>
              <CCard className="card-style">{usuarioMock.nome}</CCard>

              <p>E-mail</p>
              <CCard className="card-style">{usuarioMock.email}</CCard>

              <p>Data de Nascimento</p>
              <CCard className="card-style">{usuarioMock.dataNascimento}</CCard>

              <CButton className="custom-button px-4">Editar informações</CButton>
            </CCol>

            <CCol md={2}></CCol>

            <CCol md={3} style={{ textAlign: 'center' }}>
              <h5 style={{ marginBottom: '1.5rem', marginTop: '1rem', textAlign: 'center' }}>
                Dados da sua conta
              </h5>

              <CCard className="icon-card-style first">
                <CIcon className="mt-2" icon={cilTags} size="xxl" />
                <p className="label-style">Você possui</p>
                <p className="bold-style">{usuarioMock.totalAnuncios} anúncios</p>
              </CCard>

              <CCard className="icon-card-style">
                <CIcon className="mt-2" icon={cilFilterFrames} size="xxl" />
                <p className="label-style">Você possui</p>
                <p className="bold-style">{usuarioMock.totalInteresses} interesses</p>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </CCard>
    </div>
  )
}

export default Profile
