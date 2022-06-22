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
 
 