import React, { useRef, useState, useEffect } from 'react'
import { CButton, CCard, CImage, CCol, CForm, CFormInput, CRow, CFormSelect } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCamera, cilChevronLeft } from '@coreui/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { db, storage, auth } from 'src/firebase/firebaseConfig'
import { collection, getDocs, doc, addDoc, where, query, updateDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const AnnouncementInput = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [imagem, setImagem] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const inputRef = useRef(null)

  // Estados para os seletores hierárquicos
  const [editMode, setEditMode] = useState(false)
  const [announcementId, setAnnouncementId] = useState(null)
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

  const pageTitle = editMode ? 'Editar Anúncio' : 'Cadastro de Anúncio'
  // Carrega categorias ao montar o componente
  useEffect(() => {
    if (location.state?.editMode) {
      setEditMode(true)
      setAnnouncementId(location.state.announcementData.id)

      // Preenche os campos do formulário
      const { announcementData } = location.state
      setSelectedCategory(announcementData.category_id || '')
      setSelectedSubcategory(announcementData.subcategory_id || '')
      setSelectedProduct(announcementData.product_id || '')
      setPrice(announcementData.price?.toString() || '')
      setCep(announcementData.cep || '')

      // Se tiver imagem no anúncio, carrega também
      if (announcementData.image_url) {
        setImagem(announcementData.image_url)
      }
    }
  }, [location.state])

  // Carrega categorias, subcategorias e produtos
  useEffect(() => {
    const loadCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'))
      const loadedCategories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCategories(loadedCategories)

      // Se estiver no modo de edição, carrega os dados do anúncio
      if (location.state?.editMode) {
        const { category_id, subcategory_id, product_id } = location.state.announcementData
        setSelectedCategory(category_id)

        // Carrega subcategorias da categoria selecionada
        const selectedCat = loadedCategories.find((cat) => cat.id === category_id)
        if (selectedCat?.subcategories) {
          setSubcategories(selectedCat.subcategories)
          setSelectedSubcategory(subcategory_id)

          // Carrega produtos da subcategoria selecionada
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
          setSelectedProduct(product_id)
        }
      }
    }

    loadCategories()
  }, [location.state])

  // Carrega subcategorias quando a categoria muda (modo criação)
  useEffect(() => {
    const loadSubcategories = async () => {
      if (selectedCategory) {
        const categoryDoc = await getDoc(doc(db, 'categories', selectedCategory))
        if (categoryDoc.exists()) {
          setSubcategories(categoryDoc.data().subcategories || [])
        }
      } else {
        setSubcategories([])
        setSelectedSubcategory('')
        setProducts([])
        setSelectedProduct('')
      }
    }

    // Executa apenas no modo de criação ou quando a categoria muda
    if (
      !location.state?.editMode ||
      selectedCategory !== location.state?.announcementData?.category_id
    ) {
      loadSubcategories()
    }
  }, [selectedCategory, location.state])

  // Carrega produtos quando a subcategoria muda (modo criação)
  useEffect(() => {
    const loadProducts = async () => {
      if (selectedSubcategory) {
        const productsQuery = query(
          collection(db, 'products'),
          where('subcategories_id', '==', selectedSubcategory),
        )
        const productsSnapshot = await getDocs(productsQuery)
        setProducts(
          productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        )
      } else {
        setProducts([])
        setSelectedProduct('')
      }
    }

    // Executa apenas no modo de criação ou quando a subcategoria muda
    if (
      !location.state?.editMode ||
      selectedSubcategory !== location.state?.announcementData?.subcategory_id
    ) {
      loadProducts()
    }
  }, [selectedSubcategory, location.state])

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImagem(URL.createObjectURL(file))
      setImageFile(file)
    }
  }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const user = auth.currentUser
      if (!user) {
        alert('Você precisa estar logado para criar/editar um anúncio.')
        return
      }

      const announcementData = {
        product_id: selectedProduct,
        category_id: selectedCategory,
        subcategory_id: selectedSubcategory,
        price: parseFloat(price),
        cep,
        user_id: user.uid,
        status: 'active',
        ...(imageFile &&
          {
            // Se tiver nova imagem, será processado abaixo
          }),
      }

      if (editMode) {
        // Lógica para atualizar o anúncio existente
        await updateDoc(doc(db, 'announcements', announcementId), announcementData)
        alert('Anúncio atualizado com sucesso!')
      } else {
        // Lógica para criar novo anúncio
        announcementData.created_at = new Date()
        await addDoc(collection(db, 'announcements'), announcementData)
        alert('Anúncio criado com sucesso!')
      }

      navigate('/announcements')
    } catch (error) {
      console.error('Erro:', error)
      alert(`Erro ao ${editMode ? 'atualizar' : 'criar'} anúncio. Tente novamente.`)
    }
  }

  return (
    <div className="container mt-4">
      <CCard>
        <CButton
          size="m"
          onClick={() => navigate('/announcements')}
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

                <p className="">Preço (R$)</p>
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
                  placeholder="Digite o preço (R$)"
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
            <CCol md={1}></CCol>
            <CCol md={5} style={{ textAlign: 'center' }}>
              <p>Imagem do Produto</p>

              <CButton
                color="light"
                onClick={handleClick}
                style={{
                  width: '220px',
                  height: '220px',
                  padding: 0,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'rgb(29, 34, 43)',
                  borderWidth: '3px',
                }}
              >
                {imagem ? (
                  <CImage
                    src={imagem}
                    alt="Imagem do produto"
                    fluid
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                  />
                ) : (
                  <span>
                    <CIcon icon={cilCamera} size="6xl" />
                  </span>
                )}
              </CButton>

              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
                required
              />
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

export default AnnouncementInput
