import { useState } from 'react'
import { CButton } from '@coreui/react'

const ToggleButton = () => {
  const [isVendedor, setIsVendedor] = useState(true)

  const toggleRole = () => {
    setIsVendedor(!isVendedor)
  }

  return (
    <CButton
      onClick={toggleRole}
      shape="rounded-pill" // Formato cilíndrico horizontal
      className="text-white fw-bold px-4 py-2" // Texto branco e negrito com padding
      color={isVendedor ? 'warning' : 'primary'} // Laranja (warning) ou Azul (primary)
    >
      {isVendedor ? 'Vendedor' : 'Comprador'}
    </CButton>
  )
}

export default ToggleButton
