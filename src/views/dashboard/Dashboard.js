import { CCard, CCardBody, CCarousel, CCarouselCaption, CCarouselItem, CImage } from '@coreui/react'

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Página Inicial</h1>
      <CCard>
        <CCardBody>
          <div className="mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
            <CCarousel controls indicators dark>
              <CCarouselItem>
                <CImage
                  className="d-block w-100"
                  src="https://images.tcdn.com.br/img/img_prod/993382/console_playstation_5_ea_sports_fc_24_845_1_a5bd98d8637866eb1cda40ef27fabe36.png"
                  alt="Imagem 1"
                />
                <CCarouselCaption className="d-none d-md-block">
                  <h5>Primeira Imagem</h5>
                </CCarouselCaption>
              </CCarouselItem>
              <CCarouselItem>
                <CImage
                  className="d-block w-100"
                  src="https://rukminim2.flixcart.com/blobio/400/400/20181015/blobio-20181015_ql5avu84.jpg?q=90"
                  alt="Imagem 2"
                />
                <CCarouselCaption className="d-none d-md-block">
                  <h5>Segunda Imagem</h5>
                </CCarouselCaption>
              </CCarouselItem>
              <CCarouselItem>
                <CImage
                  className="d-block w-100"
                  src="https://photos.enjoei.com.br/cadeira-de-praia-aluminio-81339276/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xNTkyOTg2Mi85N2EyMDZiZWFjY2EyYjRkNjhkOGFkMGM0N2Q2MmQ5Yy5qcGc"
                  alt="Imagem 3"
                />
                <CCarouselCaption className="d-none d-md-block">
                  <h5>Terceira Imagem</h5>
                </CCarouselCaption>
              </CCarouselItem>
            </CCarousel>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}



export default Dashboard
