import React, { useEffect, useRef } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Página Inicial</h1>
      <CCard>
        <CCardBody>
          <CCarousel controls indicators dark>
            <CCarouselItem>
              <CImage
                className="d-block w-100"
                src="https://via.placeholder.com/800x400.png?text=Imagem+1"
                alt="Imagem 1"
              />
              <CCarouselCaption className="d-none d-md-block">
                <h5>Primeira Imagem</h5>
              </CCarouselCaption>
            </CCarouselItem>
            <CCarouselItem>
              <CImage
                className="d-block w-100"
                src="https://via.placeholder.com/800x400.png?text=Imagem+2"
                alt="Imagem 2"
              />
              <CCarouselCaption className="d-none d-md-block">
                <h5>Segunda Imagem</h5>
              </CCarouselCaption>
            </CCarouselItem>
            <CCarouselItem>
              <CImage
                className="d-block w-100"
                src="https://via.placeholder.com/800x400.png?text=Imagem+3"
                alt="Imagem 3"
              />
              <CCarouselCaption className="d-none d-md-block">
                <h5>Terceira Imagem</h5>
              </CCarouselCaption>
            </CCarouselItem>
          </CCarousel>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default MainChart
