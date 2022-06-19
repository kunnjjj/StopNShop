import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
import { getUserDetails } from "../actions/userActions";
import { updateUserProfile } from "../actions/userActions";

const ProfileScreen = () => {
    const [name,setName]=useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message,setMessage]=useState(null)

    const navigate = useNavigate()

    const dispatch = useDispatch()
    
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo}=userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const {success}=userUpdateProfile

    const submitHandler = (e) => {
        e.preventDefault()
        //DISPATCH REGISTER
        if(password!==confirmPassword){
            setMessage('Passwords do not match')
        } else{
            //DISPATCH UPDATE PROFILE
            dispatch(updateUserProfile({id:user._id,name,email,password}))
        }
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        } else{
            if(!user.name){
                dispatch(getUserDetails('profile'))
            } else{
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch,navigate, userInfo,user])

    return <Row>
        <Col md={3}>
        <h2>User Profile</h2>
        {error && <Message variant='danger'>{error}</Message>}
        {message && <Message variant='danger'>{message}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
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
                Update
            </Button>

        </Form>
        
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
        </Col>
    </Row>
}

export default ProfileScreen