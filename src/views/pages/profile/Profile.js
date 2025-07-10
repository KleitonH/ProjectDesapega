import React, { useState, useEffect, useRef } from 'react'
import { CButton, CCard, CCol, CRow, CAvatar, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilterFrames, cilTags, cilSave, cilPencil } from '@coreui/icons'
import { auth, db, storage } from 'src/firebase/firebaseConfig'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getCountFromServer,
  onSnapshot,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'
import './Profile.css'

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    birthday: '',
    avatar: '',
    totalAnuncios: 0,
    totalInteresses: 0,
  })
  const [editMode, setEditMode] = useState(false)
  const [tempAvatar, setTempAvatar] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const avatarInputRef = useRef(null)

  // Busca dados do usuário e contagens
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Busca dados básicos do usuário
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()

            // Busca contagens em paralelo
            const [anunciosCount, interessesCount] = await Promise.all([
              getCountFromServer(
                query(collection(db, 'announcements'), where('user_id', '==', user.uid)),
              ),
              getCountFromServer(
                query(collection(db, 'interests'), where('user_id', '==', user.uid)),
              ),
            ])
            setUserData({
              name: data.name || '',
              email: data.email || user.email || '',
              birthday: data.birthday || '',
              avatar: data.avatar || '',
              totalAnuncios: anunciosCount.data().count,
              totalInteresses: interessesCount.data().count,
            })
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error)
        }
      }
      setLoading(false)
    })

    return () => unsubscribeAuth()
  }, [])

  const formatBrazilianDate = (dateString) => {
    if (!dateString) return ''

    // Corrige o problema do timezone criando a data no UTC
    const parts = dateString.split('-') // Assume formato yyyy-mm-dd
    if (parts.length === 3) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1 // Meses são 0-indexed
      const day = parseInt(parts[2])

      // Cria a data em UTC para evitar problemas de timezone
      const date = new Date(Date.UTC(year, month, day))

      // Formata como dd/mm/yyyy
      const formattedDay = date.getUTCDate().toString().padStart(2, '0')
      const formattedMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const formattedYear = date.getUTCFullYear()

      return `${formattedDay}/${formattedMonth}/${formattedYear}`
    }

    return dateString // Retorna original se não estiver no formato esperado
  }

  // Atualiza contagens em tempo real
  useEffect(() => {
    if (!auth.currentUser) return

    const unsubscribeAnuncios = onSnapshot(
      query(collection(db, 'announcements'), where('user_id', '==', auth.currentUser.uid)),
      (snapshot) => {
        setUserData((prev) => ({ ...prev, totalAnuncios: snapshot.size }))
      },
    )

    const unsubscribeInteresses = onSnapshot(
      query(collection(db, 'interests'), where('user_id', '==', auth.currentUser.uid)),
      (snapshot) => {
        setUserData((prev) => ({ ...prev, totalInteresses: snapshot.size }))
      },
    )

    return () => {
      unsubscribeAnuncios()
      unsubscribeInteresses()
    }
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validação do tipo de arquivo
      if (!file.type.match('image.*')) {
        alert('Por favor, selecione um arquivo de imagem (JPEG, PNG, etc.)')
        return
      }

      // Validação do tamanho do arquivo (2MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter menos de 2MB')
        return
      }

      setTempAvatar(URL.createObjectURL(file))
      setAvatarFile(file)
    }
  }

  const triggerAvatarInput = () => {
    avatarInputRef.current?.click()
  }

  const handleSave = async () => {
    if (!auth.currentUser) return

    setUpdating(true)
    try {
      let avatarUrl = userData.avatar

      // Upload da nova imagem se existir
      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/profile.jpg`)
        await uploadBytes(storageRef, avatarFile)
        avatarUrl = await getDownloadURL(storageRef)
      }

      // Atualiza os dados no Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: userData.name,
        birthday: userData.birthday,
        ...(avatarUrl && { avatar: avatarUrl }),
      })

      // Atualiza o estado local
      setUserData((prev) => ({
        ...prev,
        ...(avatarUrl && { avatar: avatarUrl }),
      }))

      setEditMode(false)
      setTempAvatar(null)
      setAvatarFile(null)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <CCard className="p-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando seu perfil...</p>
        </CCard>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '850px', width: '100%' }}>
          <CRow className="mt-4 align-items-center p-3">
            <CCol md={1} className="position-relative">
              <CAvatar
                src={tempAvatar || userData.avatar || '/default-avatar.jpg'}
                size="xl"
                onClick={editMode ? triggerAvatarInput : undefined}
                style={{
                  cursor: editMode ? 'pointer' : 'default',
                  border: editMode ? '2px dashed #3a4458' : 'none',
                }}
              />
              {editMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    className="avatar-edit-badge"
                    onClick={triggerAvatarInput}
                    title="Alterar foto"
                  >
                    <CIcon icon={cilPencil} size="sm" />
                  </div>
                </>
              )}
            </CCol>
            <CCol md={6}>
              {editMode ? (
                <CFormInput
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="mb-2 fw-bold fs-4"
                />
              ) : (
                <h4>{userData.name || 'Usuário'}</h4>
              )}
              <p className="text-muted">{userData.email}</p>
            </CCol>
          </CRow>

          <div className="divider"></div>

          <CRow className="p-3">
            <CCol md={6}>
              <h5 className="section-title">Informações pessoais</h5>

              <div className="mb-3">
                <label className="form-label">Nome Completo</label>
                {editMode ? (
                  <CFormInput
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                ) : (
                  <CCard className="info-card">{userData.name || 'Não informado'}</CCard>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Data de Nascimento</label>
                {editMode ? (
                  <CFormInput
                    type="date"
                    value={userData.birthday}
                    onChange={(e) => setUserData({ ...userData, birthday: e.target.value })}
                  />
                ) : (
                  <CCard className="info-card">
                    {userData.birthday ? formatBrazilianDate(userData.birthday) : 'Não informada'}
                  </CCard>
                )}
              </div>

              {editMode ? (
                <div className="d-flex gap-2">
                  <CButton
                    color="primary"
                    className="action-button"
                    onClick={handleSave}
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-2" />
                        Salvar alterações
                      </>
                    )}
                  </CButton>
                  <CButton
                    color="secondary"
                    className="action-button"
                    onClick={() => {
                      setEditMode(false)
                      setTempAvatar(null)
                      setAvatarFile(null)
                    }}
                  >
                    Cancelar
                  </CButton>
                </div>
              ) : (
                <CButton
                  color="primary"
                  className="action-button"
                  onClick={() => setEditMode(true)}
                >
                  <CIcon icon={cilPencil} className="me-2" />
                  Editar informações
                </CButton>
              )}
            </CCol>

            <CCol md={1}></CCol>

            <CCol md={4} className="stats-section">
              <h5 className="section-title">Dados da sua conta</h5>

              <CCard className="stat-card">
                <div className="stat-icon">
                  <CIcon icon={cilTags} size="xl" />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total de anúncios</p>
                  <p className="stat-value">{userData.totalAnuncios}</p>
                </div>
              </CCard>

              <CCard className="stat-card mt-3">
                <div className="stat-icon">
                  <CIcon icon={cilFilterFrames} size="xl" />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total de interesses</p>
                  <p className="stat-value">{userData.totalInteresses}</p>
                </div>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </CCard>
    </div>
  )
}

export default Profile
