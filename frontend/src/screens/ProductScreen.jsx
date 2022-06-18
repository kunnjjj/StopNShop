import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import { Link,useParams} from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
// import products from '../products'
import Rating from "../components/Rating"
// import { useState } from 'react'
import { useEffect } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import { listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
const ProductScreen = () => {
    const {id}=useParams();
    // const [product,setProduct]=useState({})
    const dispatch=useDispatch()
    useEffect(()=>{
        dispatch(listProductDetails(id))
    },[dispatch,id])

    const productDetails=useSelector(state=>state.productDetails)
    const {loading,error,product}=productDetails

    return (
        <>
       <Link className='btn btn-light my-3' to="/">Go Back</Link>
       {loading? <Loader/> : error ?<Message variant='danger'>{error}</Message>:
        <Row>
        <Col md={6}>
            <Image src={product.image} alt={product.name} fluid/>
        </Col>
        <Col md={3}>
            <ListGroup variant='flush'>
                <ListGroupItem>
                <h2>{product.name}</h2>
                </ListGroupItem>
                <ListGroupItem>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} /> 
                </ListGroupItem>
                <ListGroupItem>
                    Price: <i className="fas fa-rupee"></i> {product.price}
                </ListGroupItem>
                <ListGroupItem>
                    Description: {product.description}
                </ListGroupItem>
            </ListGroup>
        </Col>
        <Col md={3}>
            <Card >
                <ListGroup variant='flush'>
                    <ListGroupItem>
                        <Row>
                            <Col>
                            Price:
                            </Col>
                            <Col>
                            <strong><i className="fas fa-rupee"></i> {product.price}</strong>
                            </Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col>
                            Status:
                            </Col>
                            <Col>
                            {product.countInStock>0 ? 'In Stock': 'Out of Stock'}
                            </Col>  
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Button className='w-100' type='button' disabled={product.countInStock===0}>ADD TO CART</Button>
                    </ListGroupItem>
                </ListGroup>
            </Card>
        </Col>
    </Row>
       }
        
        </>
    )
}

export default ProductScreen
