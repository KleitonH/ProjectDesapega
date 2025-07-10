import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CRow,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from 'src/firebase/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import './Proposal.css'

const Proposal = () => {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [proposalToDelete, setProposalToDelete] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [hasChat, setHasChat] = useState(false)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        await loadProposals(user.uid)
      } else {
        setCurrentUser(null)
        setProposals([])
      }
      setLoading(false)
    })

    return () => unsubscribeAuth()
  }, [])

  const loadProposals = async (userId) => {
    try {
      const proposalsQuery = query(collection(db, 'proposals'), where('seller_id', '==', userId))
      const querySnapshot = await getDocs(proposalsQuery)

      const loadedProposals = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const proposalData = doc.data()

          // Verificar se existe chat vinculado
          const chatQuery = query(collection(db, 'chats'), where('proposal_id', '==', doc.id))
          const chatSnapshot = await getDocs(chatQuery)
          const hasActiveChat =
            !chatSnapshot.empty && chatSnapshot.docs[0].data().status !== 'canceled'

          return {
            id: doc.id,
            ...proposalData,
            hasActiveChat,
          }
        }),
      )

      setProposals(loadedProposals)
    } catch (error) {
      console.error('Erro ao carregar propostas:', error)
      setProposals([])
    }
  }

  const handleDeleteClick = async (proposal) => {
    // Verificar se existe chat ativo vinculado
    const chatQuery = query(collection(db, 'chats'), where('proposal_id', '==', proposal.id))
    const chatSnapshot = await getDocs(chatQuery)
    const activeChat = !chatSnapshot.empty && chatSnapshot.docs[0].data().status !== 'canceled'

    setHasChat(activeChat)
    setProposalToDelete(proposal)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!proposalToDelete) return

    try {
      // 1. Verificar e atualizar chat vinculado se existir
      if (hasChat) {
        const chatsQuery = query(
          collection(db, 'chats'),
          where('proposal_id', '==', proposalToDelete.id),
        )
        const chatsSnapshot = await getDocs(chatsQuery)

        if (!chatsSnapshot.empty) {
          const chatDoc = chatsSnapshot.docs[0]
          await updateDoc(doc(db, 'chats', chatDoc.id), {
            status: 'canceled',
            updated_at: new Date(),
          })
        }
      }

      // 2. Deletar a proposta
      await deleteDoc(doc(db, 'proposals', proposalToDelete.id))

      // 3. Atualizar lista
      setProposals((prev) => prev.filter((p) => p.id !== proposalToDelete.id))

      setShowDeleteModal(false)
      setProposalToDelete(null)
    } catch (error) {
      console.error('Erro ao deletar proposta:', error)
    }
  }

  const getStatusBadge = (status) => {
    let color, text
    switch (status) {
      case 'pending':
        color = 'warning'
        text = 'Pendente'
        break
      case 'accepted':
        color = 'success'
        text = 'Aceita'
        break
      case 'refused':
        color = 'danger'
        text = 'Recusada'
        break
      case 'finished':
        color = 'primary'
        text = 'Finalizada'
        break
      default:
        color = 'secondary'
        text = 'Desconhecido'
    }

    return <CBadge color={color}>{text}</CBadge>
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <CCard>
        <div className="mx-auto" style={{ maxWidth: '1000px', width: '100%' }}>
          <CCol md={9}>
            <h2 style={{ marginBottom: '2rem', marginTop: '3rem' }}>Propostas Enviadas</h2>
          </CCol>

          {proposals.length === 0 ? (
            <div className="text-center py-5">
              <h4>Nenhuma proposta encontrada</h4>
            </div>
          ) : (
            <CRow>
              {proposals.map((proposal) => (
                <CCol key={proposal.id} className="mt-4 align-items-center" md={4} lg={3}>
                  <CCard
                    style={{
                      width: '100%',
                      minHeight: '22rem',
                      textAlign: 'center',
                      marginBottom: '2rem',
                      position: 'relative',
                    }}
                  >
                    <CCardBody>
                      <div className="d-flex justify-content-between align-items-start">
                        <CCardTitle>{proposal.product_name}</CCardTitle>
                        {getStatusBadge(proposal.status)}
                      </div>

                      {proposal.hasActiveChat && (
                        <CBadge color="info" className="mb-2">
                          Chat ativo
                        </CBadge>
                      )}
                    </CCardBody>

                    <CCardImage
                      className="image-style mx-auto"
                      src={proposal.product_image || 'https://via.placeholder.com/300'}
                    />

                    <CCardBody>
                      <CRow className="align-items-center d-flex justify-content-between">
                        <CCol md={8}>
                          <h2 style={{ paddingTop: '15px' }}>
                            R${' '}
                            {proposal.price.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </h2>
                        </CCol>
                        <CCol md={4}>
                          <CButton
                            color="danger"
                            onClick={() => handleDeleteClick(proposal)}
                            disabled={proposal.status === 'accepted' && proposal.hasActiveChat}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          )}
        </div>
      </CCard>

      {/* Modal de confirmação de exclusão */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {hasChat ? (
            <p>
              Esta proposta possui um chat de venda vinculado. Ao excluir, o chat será cancelado.
              Tem certeza?
            </p>
          ) : (
            <p>Tem certeza que deseja excluir esta proposta?</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Confirmar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Proposal
