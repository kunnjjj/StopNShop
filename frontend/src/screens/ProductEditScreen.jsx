import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import {PRODUCT_DETAILS_SUCCESS, PRODUCT_UPDATE_RESET} from '../constants/productConstants'
import { useParams } from 'react-router'
import axios from 'axios'
import { updateProduct } from "../actions/productActions";

const ProductEditScreen = () => {
    const { id: productId } = useParams()
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)


    const navigate = useNavigate()

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails
    // console.log("user details: "+ JSON.stringify(userDetails))
    // console.log("loading: ",loading)

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = productUpdate
  

    // // console.log("userId: ",userId) 
    // console.log("product : ",product)
    // console.log("prodid " + productId)

    useEffect(() => {
        // console.log("user: ",user)    
        if(successUpdate){
            dispatch({type:PRODUCT_UPDATE_RESET})
            navigate('/admin/productlist')
        } else{
            if (!product.name) {
                const func=async()=>{
                    const {data}=await axios.get(`/api/products/${productId}`)
    
                    // console.log("Products data")
                    // console.log(data);
                    dispatch({
                        type:PRODUCT_DETAILS_SUCCESS,
                        payload:data
                    })
                }
                func()
                
            } else {
                setName(product.name)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
        
    }, [product, productId, dispatch, navigate,successUpdate])

    const uploadFileHandler=async(e)=>{
        const file=e.target.files[0]
        const formData=new FormData()
        formData.append('image',file)
        setUploading(true)
        
        try{
            const config={
                headers:{
                    'Content-Type':'multipart/form-data'
                },
            }
            const {data}= await axios.post('/api/upload',formData,config)
            setImage(data)
            setUploading(false)

        } catch(error){
            console.log(error)
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id:productId,
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock
        }))
    }

    return (<>
        <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back </Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (

                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' placeholder="Enter Name" value={name}
                                onChange={(e) => setName(e.target.value)} >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="price" className='py-3'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' placeholder="Enter Price" value={price}
                                onChange={(e) => setPrice(e.target.value)} >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="image" className='py-3'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='text' placeholder="Enter Image URL" value={image}
                                onChange={(e) => setImage(e.target.value)} >
                            </Form.Control>
                            <Form.Control 
                            
                            label='Choose File' 
                          
                            type="file"
                            onChange={uploadFileHandler} >
                            </Form.Control>
                            {uploading &&  <Loader/>}
                        </Form.Group>

                        <Form.Group controlId="brand" className='py-3'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type='text' placeholder="Enter Brand" value={brand}
                                onChange={(e) => setBrand(e.target.value)} >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="countInStock" className='py-3'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control type='number' placeholder="Enter Count In Stock" value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)} >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="category" className='py-3'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control type='text' placeholder="Enter Category" value={category}
                                onChange={(e) => setCategory(e.target.value)} >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="description" className='py-3'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='text' placeholder="Enter Description" value={description}
                                onChange={(e) => setDescription(e.target.value)} >
                            </Form.Control>
                        </Form.Group>


                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>

                )}
        </FormContainer>
    </>
    )


}

export default ProductEditScreen