import React, { useContext, useState } from 'react'
import { CButton } from '@coreui/react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'src/firebase/firebaseConfig'
import { AuthContext } from '../../context/AuthContext'

const ToggleButton = () => {
  const [loading, setLoading] = useState(false)
  const { user, role, setRole } = useContext(AuthContext)

  const toggleRole = async () => {
    if (!user || !role) return

    const newRole = role === 'vendedor' ? 'comprador' : 'vendedor'
    const userDocRef = doc(db, 'users', user.uid)

    setLoading(true)
    try {
      await updateDoc(userDocRef, { role: newRole })
      setRole(newRole) // atualiza o contexto pra atualizar a UI
    } catch (error) {
      console.error('Erro ao atualizar role:', error)
      // opcional: mostrar um toast ou alerta para o usuário
    } finally {
      setLoading(false)
    }
  }

  if (!role) return null // ou loading, se quiser

  return (
    <CButton
      onClick={toggleRole}
      shape="rounded-pill"
      className="text-white fw-bold px-4 py-2"
      color={role === 'vendedor' ? 'warning' : 'primary'}
      disabled={loading}
    >
      {role === 'vendedor' ? 'Vendedor' : 'Comprador'}
    </CButton>
  )
}

export default ToggleButton
