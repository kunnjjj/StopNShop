import React, { useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import {createOrder} from '../actions/orderActions'
import { useNavigate } from 'react-router-dom'
import Meta from "../components/Meta";

const PlaceOrderScreen = () => {
    // console.log("hi from placeorder")
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const addDecimal = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    const cart = useSelector(state => state.cart)
    // console.log(cart)
    cart.itemsPrice = addDecimal(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    cart.shippingPrice = addDecimal(cart.itemsPrice > 200 ? 0 : 40)
    cart.taxPrice = addDecimal(Number((0.18 * cart.itemsPrice).toFixed(2)))
    cart.totalPrice = (addDecimal(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(Number(cart.taxPrice))))
    
    const orderCreate=useSelector(state => state.orderCreate)
    const {order,success,error}=orderCreate
 
    useEffect(()=>{
        if(success){
            // eslint-disable-next-line
            // console.log("order in useEffect" +JSON.stringify(order))
            const {order:ORDER}=JSON.parse(JSON.stringify(order))
            // console.log(ORDER)
            navigate(`/orders/${ORDER._id}`)
        }
    },[navigate,success,order])

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
            orderItems:cart.cartItems,
            shippingAddress:cart.shippingAddress,
            paymentMethod:cart.paymentMethod,
            itemsPrice:cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            taxPrice:cart.taxPrice,
            totalPrice:cart.totalPrice
        }))
    }

    return (
        <>
            <Meta title='Place Order' />
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Shipping</h2>
                            <p>
                                <span>Address:</span>{' '}
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <span>Method:</span>{' '}
                            {cart.paymentMethod}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? <Message>Your cart in empty</Message> :

                                <ListGroup variant='flush'>

                                    {cart.cartItems.map((item, index) => (
                                        <ListGroupItem key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x <i className="fa-solid fa-rupee-sign"></i> {item.price} = <i className="fa-solid fa-rupee-sign"></i> {item.price * item.qty}
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            }

                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <h2>Order Summary</h2>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Items</Col>
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {cart.itemsPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {cart.shippingPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {cart.taxPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Total</Col>
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {cart.totalPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                {error && <Row><Message variant='danger'>{error}</Message></Row>}
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>PLACE ORDER</Button>
                                </Row>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>


    )
}

export default PlaceOrderScreen
