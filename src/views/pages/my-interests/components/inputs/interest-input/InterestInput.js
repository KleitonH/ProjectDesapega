import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { db, auth } from 'src/firebase/firebaseConfig'
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDoc,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const InterestInput = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Estados para os seletores hierárquicos
  const [editMode, setEditMode] = useState(false)
  const [interestId, setInterestId] = useState(null)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])

  // Valores selecionados
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')

  // Outros campos do formulário
  const [price, setPrice] = useState('')
  const [cep, setCep] = useState('')
  const [description, setDescription] = useState('')

  const pageTitle = editMode ? 'Editar Interesse' : 'Cadastro de Interesse'

  // Carrega dados iniciais
  useEffect(() => {
    if (location.state?.editMode) {
      setEditMode(true)
      setInterestId(location.state.interestData.id)

      // Preenche os campos do formulário
      const { interestData } = location.state
      setSelectedCategory(interestData.category_id || '')
      setSelectedSubcategory(interestData.subcategory_id || '')
      setSelectedProduct(interestData.product_id || '')
      setPrice(interestData.price?.toString() || '')
      setCep(interestData.cep || '')
      setDescription(interestData.description || '')
    }
  }, [location.state])
  
  // Carrega categorias, subcategorias e produtos
  useEffect(() => {
    const loadData = async () => {
      // 1. Carrega categorias primeiro
      const categoriesSnapshot = await getDocs(collection(db, 'categories'))
      const loadedCategories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCategories(loadedCategories)

      // 2. Se estiver editando, processa subcategorias
      if (location.state?.editMode) {
        const { category_id, subcategory_id, product_id } = location.state.interestData

        // Define a categoria selecionada (dispara a lógica de subcategorias)
        setSelectedCategory(category_id)

        // Espera o state atualizar e carrega subcategorias
        const selectedCat = loadedCategories.find((cat) => cat.id === category_id)
        if (selectedCat?.subcategories) {
          setSubcategories(selectedCat.subcategories)

          // Verifica e define a subcategoria
          if (
            subcategory_id &&
            selectedCat.subcategories.some((sub) => sub.id === subcategory_id)
          ) {
            setSelectedSubcategory(subcategory_id)

            // 3. Carrega produtos após subcategoria ser definida
            const productsQuery = query(
              collection(db, 'products'),
              where('subcategories_id', '==', subcategory_id),
            )
            const productsSnapshot = await getDocs(productsQuery)
            const loadedProducts = productsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            setProducts(loadedProducts)

            // Define o produto se existir
            if (product_id && loadedProducts.some((prod) => prod.id === product_id)) {
              setSelectedProduct(product_id)
            }
          }
        }
      }
    }

    loadData()
  }, [location.state]) // Apenas location.state como dependência

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const user = auth.currentUser
      if (!user) {
        alert('Você precisa estar logado para criar/editar um interesse.')
        return
      }

      const interestData = {
        product_id: selectedProduct,
        category_id: selectedCategory,
        subcategory_id: selectedSubcategory,
        price: parseFloat(price),
        cep,
        description,
        user_id: user.uid,
        status: 'active',
      }

      if (editMode) {
        await updateDoc(doc(db, 'interests', interestId), interestData)
        alert('Interesse atualizado com sucesso!')
      } else {
        interestData.created_at = new Date()
        await addDoc(collection(db, 'interests'), interestData)
        alert('Interesse criado com sucesso!')
      }

      navigate('/interests')
    } catch (error) {
      console.error('Erro:', error)
      alert(`Erro ao ${editMode ? 'atualizar' : 'criar'} interesse. Tente novamente.`)
    }
  }

  return (
    <div className="container mt-4">
      <CCard>
        <CButton
          size="m"
          onClick={() => navigate('/interests')}
          style={{ width: '5rem', marginLeft: '3rem', marginTop: '2rem' }}
        >
          <CIcon size="xxl" icon={cilChevronLeft} className="me-2" />
        </CButton>

        <div className="mx-auto" style={{ maxWidth: '850px', width: '100%' }}>
          <h1 style={{ marginBottom: '3rem', marginTop: '1rem', textAlign: 'center' }}>
            {pageTitle}
          </h1>
          <CRow>
            <CCol md={6}>
              <CForm onSubmit={handleSubmit}>
                <p className="">Categoria</p>
                <CFormSelect
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </CFormSelect>

                <p className="">Subcategoria</p>
                <CFormSelect
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  disabled={!selectedCategory}
                  required
                >
                  <option value="">Selecione uma subcategoria</option>
                  {subcategories.map((subcat, index) => (
                    <option key={index} value={subcat.id}>
                      {subcat.label}
                    </option>
                  ))}
                </CFormSelect>

                <p className="">Produto</p>
                <CFormSelect
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  disabled={!selectedSubcategory}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.label}
                    </option>
                  ))}
                </CFormSelect>

                <p className="">Descrição do Interesse</p>
                <CFormTextarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                    height: '100px',
                  }}
                  placeholder="Descreva seu interesse com detalhes"
                  required
                />

                <p className="">Preço Máximo (R$)</p>
                <CFormInput
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholder="Digite o preço máximo que está disposto a pagar"
                  autoComplete="preco"
                  required
                />

                <p className="">Localização (CEP)</p>
                <CFormInput
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  style={{
                    marginBottom: '15px',
                    borderColor: 'rgb(29, 34, 43)',
                    borderWidth: '3px',
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholder="Digite o CEP"
                  autoComplete="localizacao"
                  required
                />
              </CForm>
            </CCol>
          </CRow>
          <div className="d-flex justify-content-center">
            <CButton
              type="submit"
              onClick={handleSubmit}
              style={{
                backgroundColor: '#3A4458',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                margin: '50px',
                width: '400px',
              }}
              className="px-4"
            >
              Publicar
            </CButton>
          </div>
        </div>
      </CCard>
    </div>
  )
}

export default InterestInput
