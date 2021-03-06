import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUserDetails,updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import { useParams } from 'react-router'
import Meta from "../components/Meta";
const UserEditScreen = () => {
    const {id:userId} = useParams()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)


    const location = useLocation()
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails
    // console.log("user details: "+ JSON.stringify(userDetails))
    const userUpdate = useSelector(state => state.userUpdate)
    const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = userUpdate

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({_id:userId,name,email,isAdmin}))
    }
    // console.log("userId: ",userId)

    useEffect(() => {
        // console.log("user: ",user)    
        if(successUpdate) {
            dispatch({type:USER_UPDATE_RESET})
            navigate('/admin/userlist')
        } 
        else if(!user || !user.name || user._id!==userId){
            dispatch(getUserDetails(userId))
        } else {
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(!!user.isAdmin)
        }
    }, [user,userId,dispatch,successUpdate,navigate])

    return (<>
        <Meta title={user.name} />
        <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back </Link>

        <h1>Edit User</h1>
        {loadingUpdate && <Loader/>}
        {errorUpdate && <Message variant='danger'>{error}</Message>}
        {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
            : (
                <FormContainer>
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

                        <Form.Group controlId="isadmin" className='py-3'>
                            <Form.Label>Is Admin</Form.Label>
                            <Form.Check type='checkbox'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}>
                            </Form.Check>
                        </Form.Group>
                        

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>

                    </Form>

                </FormContainer>
            )
        }

    </>
    )


}

export default UserEditScreen