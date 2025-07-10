import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from 'src/firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    avatar: null,
    name: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Busca o documento do usuário no Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid))

          if (userDoc.exists()) {
            const data = userDoc.data()
            setUserData({
              avatar: data.avatar || null,
              name: data.name || user.email.split('@')[0],
              email: user.email,
            })
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (loading) {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar size="md" />
        </CDropdownToggle>
      </CDropdown>
    )
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar
          src={userData.avatar}
          size="md"
          onError={(e) => {
            e.target.src = ''
            e.target.textContent = userData.name.charAt(0).toUpperCase()
          }}
          color="primary"
          textColor="white"
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
          {userData.name || 'Usuário'}
        </CDropdownHeader>
        <CDropdownItem onClick={() => navigate('/profile')}>
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem onClick={() => navigate('/settings')}>
          <CIcon icon={cilSettings} className="me-2" />
          Configurações
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Sair
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
