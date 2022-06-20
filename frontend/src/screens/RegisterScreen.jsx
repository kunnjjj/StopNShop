import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

const RegisterScreen = () => {
    const [name,setName]=useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message,setMessage]=useState(null)

    const location = useLocation()
    const navigate = useNavigate()
    const redirect = location.search ? location.search.split('=')[1] : '/'

    const dispatch = useDispatch()
    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo } = userRegister

    const submitHandler = (e) => {
        e.preventDefault()
        //DISPATCH REGISTER
        if(password!==confirmPassword){
            setMessage('Passwords do not match')
        } else{
            dispatch(register(name,email, password))
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    return <FormContainer>
        <h1>Sign Up</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {message && <Message variant='danger'>{message}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' placeholder="Enter Name" value={name}
                    onChange={(e) => setName(e.target.value)} >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className='py-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder="Enter Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="password" className='py-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder="Enter password" value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword" className='py-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password' placeholder="Confirm Password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} >
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Register
            </Button>

        </Form>
        <Row className='py-3'>
            <Col>
                Have an Account? {' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>
                    Login
                </Link>
            </Col>
        </Row>
    </FormContainer>
}

export default RegisterScreen