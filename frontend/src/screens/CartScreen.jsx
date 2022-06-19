import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { Row, Col, Image, ListGroup, Form, Button, Card, ListGroupItem } from 'react-bootstrap'
import { addToCart } from '../actions/cartActions'

const CartScreen = () => {
    const { id: productId } = useParams()
    // console.log("prodid ", productId);
    const navigate = useNavigate()
    // console.log("nav ",navigate)
    const location = useLocation()
    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])
    const removeFromCartHandler = (id) => {
        console.log('remove')
    }

    const checkoutHandler=()=>{
        navigate('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (<Message>Your cart is empty <Link to='/'>Go Back</Link></Message>) : (
                    <ListGroup variant='flush'>
                        {cartItems.map((item) => (
                            <ListGroupItem key={item.product}>
                                {/* {console.log("item.product ",item.product)} */}
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/products/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        Rs. {item.price}
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as='select'
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(addToCart(item.product, Number(e.target.value)))}>
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Subtotal ({cartItems.reduce((acc,item)=>acc+item.qty,0)}) items</h2>
                            Rs. {cartItems.reduce((acc,item)=>acc+item.qty * item.price,0).toFixed(2)}
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button type='button' className='btn-block' disabled={cartItems.length===0} onClick={checkoutHandler}>
                                Proceed to Checkout
                            </Button>
                        </ListGroupItem>
                    </ListGroup>

                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
