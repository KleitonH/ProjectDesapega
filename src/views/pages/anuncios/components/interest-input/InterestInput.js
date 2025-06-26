import React from 'react'
import { CButton, CCard, CCol, CForm, CFormInput, CRow, CFormTextarea } from '@coreui/react'

const InterestInput = () => {
  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '500px', width: '100%' }}>
          <h1 style={{ marginBottom: '3rem', marginTop: '1rem', textAlign: 'center' }}>
            Cadastro de Interesse
          </h1>
          <CRow>
            <CCol>
              <CForm style={{}}>
                <p className="">Descrição do Interesse</p>
                <CFormTextarea
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                    height: '5rem',
                  }}
                  placeholder="Digite o nome do produto"
                  autoComplete="produto"
                />

                <p className="">Preço (R$)</p>
                <CFormInput
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                    height: '3rem',
                  }}
                  placeholder="Digite o preço (R$)"
                  autoComplete="preco"
                />

                <p className="">Localização (CEP)</p>
                <CFormInput
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                    height: '3rem',
                  }}
                  placeholder="Digite o CEP"
                  autoComplete="localizacao"
                />
              </CForm>
            </CCol>
          </CRow>
          <div className="d-flex justify-content-center">
            <CButton
              style={{
                backgroundColor: '#3A4458',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                margin: '50px',
                width: '300px',
              }}
              className="px-4"
            >
              Publicar
            </CButton>
          </div>
        </div>
      </CCard>
    </div>
  )
}

export default InterestInput
