import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil, cilPlus } from '@coreui/icons'
import './Interests.css'
import { useNavigate } from 'react-router-dom'
import { db, auth } from 'src/firebase/firebaseConfig'
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const Interests = () => {
  const navigate = useNavigate()
  const [interests, setInterests] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserInterests(user.uid)
      } else {
        setInterests([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const fetchUserInterests = async (userId) => {
    try {
      const q = query(collection(db, 'interests'), where('user_id', '==', userId))
      const querySnapshot = await getDocs(q)

      const interestsData = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const interest = docSnapshot.data()
          const productDoc = await getDoc(doc(db, 'products', interest.product_id))
          const categoryDoc = await getDoc(doc(db, 'categories', interest.category_id))

          return {
            id: docSnapshot.id,
            ...interest,
            product: productDoc.exists() ? productDoc.data() : null,
            category: categoryDoc.exists() ? categoryDoc.data() : null,
          }
        }),
      )

      setInterests(interestsData)
    } catch (error) {
      console.error('Erro ao buscar interesses:', error)
      setInterests([])
    }
  }

  const handleDelete = async (interestId) => {
    if (window.confirm('Tem certeza que deseja excluir este interesse?')) {
      try {
        await deleteDoc(doc(db, 'interests', interestId))
        setInterests(interests.filter((i) => i.id !== interestId))
      } catch (error) {
        console.error('Erro ao excluir interesse:', error)
        alert('Erro ao excluir interesse. Tente novamente.')
      }
    }
  }

  const handleEdit = (interest) => {
    navigate('/interest-input', {
      state: {
        editMode: true,
        interestData: {
          id: interest.id,
          product_id: interest.product_id,
          category_id: interest.category_id,
          subcategory_id: interest.subcategory_id,
          price: interest.price,
          cep: interest.cep,
          description: interest.description,
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
          <h3>Você precisa estar logado para ver seus interesses</h3>
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
              <h1 style={{ marginBottom: '2rem', marginTop: '3rem' }}>Meus Interesses</h1>
            </CCol>
            <CCol md={3}>
              <CButton size="m" onClick={() => navigate('/interest-input')} className="add-style">
                <CIcon size="lg" icon={cilPlus} className="me-2" />
                Novo Interesse
              </CButton>
            </CCol>
          </CRow>

          {interests.length === 0 ? (
            <div className="text-center py-5">
              <h4>Você ainda não tem interesses cadastrados</h4>
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

              {interests.map((interest) => (
                <div key={interest.id}>
                  <CRow className="mt-4 align-items-center">
                    <CCol md={4} className="cell-style">
                      {interest.product?.label || 'N/A'}
                    </CCol>
                    <CCol md={2} className="cell-style">
                      {interest.category?.label || 'N/A'}
                    </CCol>
                    <CCol md={2} className="cell-style">
                      R$ {interest.price.toFixed(2)}
                    </CCol>
                    <CCol md={4} className="cell-style">
                      <CButton size="m" className="me-2" onClick={() => handleEdit(interest)}>
                        <CIcon size="lg" icon={cilPencil} className="me-2" />
                        Editar
                      </CButton>
                      <CButton size="m" color="danger" onClick={() => handleDelete(interest.id)}>
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

export default Interests
