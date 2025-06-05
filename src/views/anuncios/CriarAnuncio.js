import React, { useRef, useState } from 'react'
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
import { cilCamera, cilUser, cibGoogle, cibFacebook } from '@coreui/icons'

const CriarAnuncio = () => {
  const [imagem, setImagem] = useState(null)
  const inputRef = useRef(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImagem(URL.createObjectURL(file))
    }
  }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '850px', width: '100%' }}>
          <h1 style={{ marginBottom: '3rem', marginTop: '1rem', textAlign: 'center' }}>
            Cadastro de Anúncio
          </h1>
          <CRow>
            <CCol md={6}>
              <CForm style={{}}>
                <p className="">Produto</p>
                <CFormInput
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
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
                  }}
                  placeholder="Digite o CEP"
                  autoComplete="localizacao"
                />
              </CForm>
            </CCol>
            <CCol md={1}></CCol>
            <CCol md={5} style={{ textAlign: 'center' }}>
              <p>Imagem do Produto</p>

              <CButton
                color="light"
                onClick={handleClick}
                style={{
                  width: '220px',
                  height: '220px',
                  padding: 0,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'rgb(29, 34, 43)',
                  borderWidth: '3px',
                }}
              >
                {imagem ? (
                  <CImage
                    src={imagem}
                    alt="Imagem do produto"
                    fluid
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                  />
                ) : (
                  <span>
                    <CIcon icon={cilCamera} size="6xl" />
                  </span>
                )}
              </CButton>

              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
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
                width: '400px',
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

export default CriarAnuncio
