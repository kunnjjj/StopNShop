import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js"

// @desc CREATE new order
// @route POST /api/orders
// @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shipingPrice,
        totalPrice
    } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    } else {
        const curOrder = new Order({
            orderItems,
            user:req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shipingPrice,
            totalPrice
        })
        const order= await curOrder.save()
        res.status(201).json({order})
    }
    
     
})


// @desc GET order by id
// @route GET /api/order/:id
// @access Private  
export const getOrderById = asyncHandler(async (req, res) => {
    
    // console.log("hello from server")
    const  order=await Order.findById(req.params.id).populate('user','name email')
    // console.log("order in server: ",order)
    if (order){
        res.json(order);
    } else{
        res.status(404)
        throw new Error("Order not Found")
    }
})
 
// @desc Update order to paid
// @route GET /api/order/:id/pay
// @access Private  
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    
    // console.log("hello from server")
    const  order=await Order.findById(req.params.id)
    // console.log("order in server: ",order)
    if (order){
        order.isPaid=true
        order.paidAt=Date.now()
        order.paymentResult={
            id:req.body.id,
            status:req.body.status,
            update_time:req.body.update_time,
            email_address:req.body.payer.email_address
        }

        const updatedOrder=await order.save()
        res.json(updatedOrder)
    } else{
        res.status(404)
        throw new Error("Order not Found")
    }
})
 
// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private  
export const getMyOrders = asyncHandler(async (req, res) => {
    
    // console.log("hello from server")
    const  orders=await Order.find({user:req.user._id})
    // console.log("order in server: ",order)
    // console.log("orders: ", orders)
    res.json(orders)
})
 
 
// @desc Get all orders
// @route GET /api/orders
// @access Private   admin
export const getOrders = asyncHandler(async (req, res) => {
    
    // console.log("hello from server")
    const  orders=await Order.find({}).populate('user','id name')
    // console.log("order in server: ",order)
    // console.log("orders: ", orders)
    res.json(orders)
})
 



// @desc Update order to delivered
// @route GET /api/order/:id/deliver
// @access Private admin 
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    
    // console.log("hello from server")
    const  order=await Order.findById(req.params.id)
    // console.log("order in server: ",order)
    if (order){
        order.isDelivered=true
        order.deliveredAt=Date.now()
        
        const updatedOrder=await order.save()
        res.json(updatedOrder)
    } else{
        res.status(404)
        throw new Error("Order not Found")
    }
})