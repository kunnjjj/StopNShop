import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'

import { listProducts } from '../actions/productActions'
const HomeScreen = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList
  
  // console.log("loading " + loading);
  // console.log("prod " + products);

  return (
    <>
      <h1>Latest Products</h1>
      {loading? <Loader/> : error ?  <Message variant='danger'>{error}</Message>:
        //  <h3></h3>
         <Row>
         {products.map(product => (
           <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
             <Product product={product} />
           </Col>
         ))}
       </Row> 
      }
    </>
  )
}


export default HomeScreen

