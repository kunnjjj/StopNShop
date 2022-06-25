import React from 'react'
import { Form, FormGroup, ListGroupItem } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
// import products from '../products'
import Rating from "../components/Rating"
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, createProductReview } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'
import { PRODUCT_CREATE_REVIEW_REQUEST } from '../constants/productConstants'



const ProductScreen = () => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const navigate = useNavigate()

    const { id } = useParams();
    // const [product,setProduct]=useState({})
    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { success: successProductReview, error: errorProductReview } = productReviewCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin




    useEffect(() => {
        if (successProductReview) {
            alert('Review Submitted')
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST })

        }
        dispatch(listProductDetails(id))
    }, [dispatch, id, successProductReview])

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        // console.log("called")
        dispatch(createProductReview(id, {
            rating,
            comment
        }))
    }
    return (
        <>
            <Link className='btn btn-light my-3' to="/">Go Back</Link>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
                <>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
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
                                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                    {product.countInStock > 0 && (
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {[...Array(product.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    )}
                                    <ListGroupItem>
                                        <Button onClick={addToCartHandler} className='w-100' type='button' disabled={product.countInStock === 0}>ADD TO CART</Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map(review => (
                                    <ListGroupItem key={review._id}>
                                        {review.name}
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroupItem>
                                ))}
                                <ListGroupItem>
                                    <h2>Write a customer review</h2>
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                    {userLogin ? (
                                        <Form onSubmit={submitHandler}>
                                            <FormGroup controlId='rating'>
                                                <Form.Label >Rating</Form.Label>
                                                <Form.Control as='select' value={rating} onChange={e => setRating(e.target.value)}>
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </FormGroup>

                                            <FormGroup controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control type='text-area' row='3' value={comment} onChange={e => setComment(e.target.value)} placeholder="Write Comment"></Form.Control>
                                            </FormGroup>
                                            <Row>
                                            
                                            <Button className='my-3 btn-sm' type='submit' variant='primary' onSubmit={submitHandler}>Submit</Button>

                                    
                                            </Row>
                                        </Form>
                                    ) : <Message>Please <Link to='/'>Sign In</Link> to write a review {' '}</Message>}
                                </ListGroupItem>
                                
                            </ListGroup>


                        </Col>
                    </Row>
                </>
            }

        </>
    )
}

export default ProductScreen
