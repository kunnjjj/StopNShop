import React, { useEffect } from "react";
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails } from '../actions/orderActions'


const OrderScreen = () => {
    // console.log("hi from placeorder")
    const { id } = useParams()
    // console.log("orderId: " +id)
    const orderId = id
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    if (!loading) {
        const addDecimal = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        // console.log(cart)
        order.itemsPrice = addDecimal(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))



    }



    useEffect(() => {
        dispatch(getOrderDetails(orderId))
    }, [dispatch, orderId])


    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :

        <>
            <h1>
                Order ID: {order._id}
            </h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Shipping</h2>
                            <p>Name: {order.user.name}</p>
                            <p>Email: <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p> 
                            <p>
                                <span>Address:</span>{' '}
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message>: <Message variant='danger'>Not Delivered</Message>}

                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <p>
                                
                            <span>Method:</span>{' '}
                            {order.paymentMethod}
                            </p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message>: <Message variant='danger'>Not Paid</Message>}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message>Your order in empty</Message> :

                                <ListGroup variant='flush'>

                                    {order.orderItems.map((item, index) => (
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
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {order.itemsPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {order.shippingPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {order.taxPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Total</Col>
                                    <Col><i className="fa-solid fa-rupee-sign"></i> {order.totalPrice}</Col>
                                </Row>
                            </ListGroupItem>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>

        </>
}

export default OrderScreen
