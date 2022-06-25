import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'
import { Row, Col, ListGroup, Image, Card, ListGroupItem, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import axios from 'axios'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";
import { useNavigate } from "react-router-dom";
import Meta from "../components/Meta";

const OrderScreen = () => {
    // console.log("hi from placeorder")
    const { id } = useParams()
    const navigate=useNavigate()

    const [sdkReady, setSdkReady] = useState(false)

    // console.log("orderId: " +id)
    const orderId = id
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay


    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    if (!loading) {
        const addDecimal = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        // console.log(cart)
        order.itemsPrice = addDecimal(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            // console.log(clientId)
            script.type = 'text/javascript'
            // https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            script.defer = true

            document.body.appendChild(script)
            // console.log(clientId)
        }

        addPayPalScript()
        if (!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, orderId, successPay, order, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return (loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :

        <>
            <Meta title='Order' />
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
                            {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}

                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <p>

                                <span>Method:</span>{' '}
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
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
                            {!order.isPaid && (
                                <ListGroupItem>
                                    <Row>
                                        {/* {!order.isPaid && (
                                            <ListGroup.Item>
                                                {loadingPay && <Loader />}
                                                {!sdkReady ? (
                                                    <Loader />
                                                ) : (
                                                    <PayPalButton
                                                        amount={order.totalPrice}
                                                        onSuccess={successPaymentHandler}
                                                    />
                                                )}
                                            </ListGroup.Item>
                                        )} */}

                                        <Col>Total</Col>
                                        <Col><i className="fa-solid fa-rupee-sign"></i> {order.totalPrice}</Col>
                                    </Row>
                                </ListGroupItem>


                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && !order.isDelivered && (
                                <ListGroupItem>
                                    <Row>
                                        <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                            Mark As Delivered
                                        </Button>
                                    </Row>
                                </ListGroupItem>
                            )}

                        </ListGroup>
                    </Card>
                </Col>
            </Row>

        </>)
}

export default OrderScreen
