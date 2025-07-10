import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCol, CRow, CImage } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil, cilPlus } from '@coreui/icons'
import './Announcements.css'
import { useNavigate } from 'react-router-dom'
import { db, auth } from 'src/firebase/firebaseConfig'
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const Announcements = () => {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Busca anúncios do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserAnnouncements(user.uid)
      } else {
        setAnnouncements([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const fetchUserAnnouncements = async (userId) => {
    try {
      const q = query(collection(db, 'announcements'), where('user_id', '==', userId))

      const querySnapshot = await getDocs(q)
      const announcementsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Busca os dados completos do produto para cada anúncio
      const announcementsWithProducts = await Promise.all(
        announcementsData.map(async (announcement) => {
          const productDoc = await getDoc(doc(db, 'products', announcement.product_id))
          const categoryDoc = await getDoc(doc(db, 'categories', announcement.category_id))

          return {
            ...announcement,
            product: productDoc.exists() ? productDoc.data() : null,
            category: categoryDoc.exists() ? categoryDoc.data() : null,
          }
        }),
      )

      setAnnouncements(announcementsWithProducts)
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error)
      setAnnouncements([])
    }
  }

  const handleDelete = async (announcementId) => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      try {
        await deleteDoc(doc(db, 'announcements', announcementId))
        setAnnouncements(announcements.filter((a) => a.id !== announcementId))
      } catch (error) {
        console.error('Erro ao excluir anúncio:', error)
        alert('Erro ao excluir anúncio. Tente novamente.')
      }
    }
  }

  const handleEdit = (announcement) => {
    navigate('/announcement-input', {
      state: {
        editMode: true,
        announcementData: {
          id: announcement.id,
          product_id: announcement.product_id,
          category_id: announcement.category_id,
          subcategory_id: announcement.subcategory_id,
          price: announcement.price,
          cep: announcement.cep,
          // Adicione outros campos necessários para edição
        },
      },
    })
  }

  if (loading) {
    return <div className="container mt-4">Carregando...</div>
  }

  if (!currentUser) {
    return (
      <div className="container mt-4">
        <CCard className="p-4">
          <h3>Você precisa estar logado para ver seus anúncios</h3>
          <CButton color="primary" onClick={() => navigate('/login')}>
            Fazer Login
          </CButton>
        </CCard>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '1000px', width: '100%' }}>
          <CRow>
            <CCol md={9}>
              <h1 style={{ marginBottom: '2rem', marginTop: '3rem' }}>Meus Anúncios</h1>
            </CCol>

            <CCol md={3}>
              <CButton
                size="m"
                className="add-style"
                onClick={() => navigate('/announcement-input')}
              >
                <CIcon size="lg" icon={cilPlus} className="me-2" />
                Novo Anúncio
              </CButton>
            </CCol>
          </CRow>

          {announcements.length === 0 ? (
            <div className="text-center py-5">
              <h4>Você ainda não tem anúncios cadastrados</h4>
            </div>
          ) : (
            <>
              <CRow className="mt-4">
                <CCol md={4} className="header-style">
                  Produto
                </CCol>
                <CCol md={2} className="header-style">
                  Categoria
                </CCol>
                <CCol md={2} className="header-style">
                  Valor
                </CCol>
                <CCol md={4} className="header-style">
                  Ações
                </CCol>
              </CRow>

              {announcements.map((announcement) => (
                <div key={announcement.id}>
                  <CRow className="mt-4 align-items-center">
                    <CCol md={4} className="cell-style">
                      {announcement.product && (
                        <>
                          <CImage
                            src={
                              announcement.product.image_url || 'https://via.placeholder.com/150'
                            }
                            alt={announcement.product.label}
                            width={170}
                            height="auto"
                          />
                          <div className="mt-2">{announcement.product.name}</div>
                        </>
                      )}
                    </CCol>
                    <CCol md={2} className="cell-style">
                      {announcement.category?.label || 'N/A'}
                    </CCol>
                    <CCol md={2} className="cell-style">
                      R$ {announcement.price.toFixed(2)}
                    </CCol>
                    <CCol md={4} className="cell-style">
                      <CButton size="m" className="me-2" onClick={() => handleEdit(announcement)}>
                        <CIcon size="lg" icon={cilPencil} className="me-2" />
                        Editar
                      </CButton>
                      <CButton
                        size="m"
                        color="danger"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <CIcon size="lg" icon={cilTrash} className="me-2" />
                        Excluir
                      </CButton>
                    </CCol>
                  </CRow>

                  <div style={{ borderTop: '2px solid #2E323D', margin: '20px 0' }}></div>
                </div>
              ))}
            </>
          )}
        </div>
      </CCard>
    </div>
  )
}

export default Announcements
