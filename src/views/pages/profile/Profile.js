import React, { useRef, useState } from 'react'
import { CButton, CCard, CImage, CCol, CForm, CFormInput, CRow, CAvatar } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLibrary, cilFilterFrames } from '@coreui/icons'
import avatar8 from '../../../assets/images/avatars/8.jpg'

const Profile = () => {
  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '850px', width: '100%' }}>
          <CRow className="mt-4">
            <CCol md={1}>
              <CAvatar src={avatar8} size="xl" />
            </CCol>
            <CCol md={6}>
              <h4>Maicon Pereira</h4>
              <p>maiconpereira@gmail.com</p>
            </CCol>
          </CRow>
          <div
            style={{
              borderTop: '2px solid rgb(150, 150, 150)',
              margin: '20px 0',
            }}
          ></div>
          <CRow>
            <CCol md={6}>
              <h5 style={{ marginBottom: '1.5rem', marginTop: '1rem', textAlign: 'center' }}>
                Informações pessoais
              </h5>
              <p>Nome Completo</p>
              <CCard
                style={{
                  marginBottom: '15px',
                  borderColor: 'rgb(29, 34, 43)',
                  borderWidth: '3px',
                  backgroundColor: 'white',
                  color: 'black',
                  height: '3rem',
                  justifyContent: 'center',
                  padding: '1rem',
                }}
              >
                Maicon Pereira
              </CCard>
              <p>E-mail</p>
              <CCard
                style={{
                  marginBottom: '15px',
                  borderColor: 'rgb(29, 34, 43)',
                  borderWidth: '3px',
                  backgroundColor: 'white',
                  color: 'black',
                  height: '3rem',
                  justifyContent: 'center',
                  padding: '1rem',
                }}
              >
                maiconpereira@gmail.com
              </CCard>
              <p>Data de Nascimento</p>
              <CCard
                style={{
                  marginBottom: '15px',
                  borderColor: 'rgb(29, 34, 43)',
                  borderWidth: '3px',
                  backgroundColor: 'white',
                  color: 'black',
                  height: '3rem',
                  justifyContent: 'center',
                  padding: '1rem',
                }}
              >
                06/08/2000
              </CCard>
              <CButton
                className="px-4"
                style={{
                  backgroundColor: '#3A4458',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '30px',
                  marginLeft: '95px',
                  marginBottom: '50px',
                  width: '200px',
                }}
              >
                Editar informações
              </CButton>
            </CCol>
            <CCol md={2}></CCol>
            <CCol md={3} style={{ textAlign: 'center' }}>
              <h5 style={{ marginBottom: '1.5rem', marginTop: '1rem', textAlign: 'center' }}>
                Dados da sua conta
              </h5>
              <CCard
                style={{
                  marginTop: '55px',
                  marginBottom: '15px',
                  borderColor: 'rgb(29, 34, 43)',
                  borderWidth: '3px',
                  backgroundColor: 'white',
                  color: 'black',
                  paddingLeft: '1rem',
                  textAlign: 'initial',
                }}
              >
                <CIcon className="mt-2" icon={cilLibrary} size="xxl" />
                <p style={{ margin: 0, marginTop: '10px', fontSize: '18px' }}>Você possui</p>
                <p style={{ margin: 0, marginBottom: '30px', fontWeight: 'bold' }}>4 anúncios</p>
              </CCard>
              <CCard
                style={{
                  marginBottom: '15px',
                  borderColor: 'rgb(29, 34, 43)',
                  borderWidth: '3px',
                  backgroundColor: 'white',
                  color: 'black',
                  paddingLeft: '1rem',
                  textAlign: 'initial',
                }}
              >
                <CIcon className="mt-2" icon={cilFilterFrames} size="xxl" />
                <p style={{ margin: 0, marginTop: '10px', fontSize: '18px' }}>Você possui</p>
                <p style={{ margin: 0, marginBottom: '30px', fontWeight: 'bold' }}>0 interesses</p>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </CCard>
    </div>
  )
}

export default Profile
