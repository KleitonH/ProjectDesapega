import React from 'react'
import { Link } from 'react-router-dom'
import AnnouncementInput from './components/announcement-input/AnnouncementInput'
import InterestInput from './components/interest-input/InterestInput'

const CriarAnuncio = () => {
  return (
    <div>
      {/* <AnnouncementInput /> */}
      <InterestInput />
    </div>
  )
}

export default CriarAnuncio
