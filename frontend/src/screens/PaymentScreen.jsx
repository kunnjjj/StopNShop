import React, { useState } from "react";
import { Form, Button, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import FormContainer from '../components/FormContainer'
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = () => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const navigate = useNavigate()
    if (!shippingAddress) {
        navigate('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const dispatch = useDispatch()



    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/payment')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>
                        Select Method
                    </Form.Label>

                    <Col>
                        <Row>
                            <Form.Check type='radio'
                                label='PayPal or Credit Card'
                                id='PayPal'
                                name='paymentMethod'
                                value='payPal'
                                checked
                                onChange={e => setPaymentMethod(e.target.value)}>
                                
                            </Form.Check>
                        </Row>
                        {/* <Row>
                            <Form.Check type='radio'
                                label='UPI'
                                id='UPI'
                                name='paymentMethod'
                                value='UPI'
                                checked
                                onChange={e => setPaymentMethod(e.target.value)}>
                                
                            </Form.Check>
                        </Row> */}
                        <Row>
                            <Form.Check type='radio'
                                label='Cash on Delivery (COD)'
                                id='Cash on Delivery'
                                name='paymentMethod'
                                value='Cash on Delivery'
                                onChange={e => setPaymentMethod(e.target.value)}>

                            </Form.Check>
                        </Row>
                        
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary' className="my-3">
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
