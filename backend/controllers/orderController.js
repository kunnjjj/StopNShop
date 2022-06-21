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
 