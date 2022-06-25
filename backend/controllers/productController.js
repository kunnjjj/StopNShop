import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js"

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts=asyncHandler(async(req,res)=>{
    const products=await Product.find({})
    // throw new Error('some err')
    res.json(products)
})


// @desc Get product 
// @route GET /api/products/:id
// @access Public
const getProductById=asyncHandler(async(req,res)=>{
    const product=await Product.findById(req.params.id)
    if(product){
        res.json(product)
    }
    else{
        res.status(404)
        throw new Error("Product not found")
    }
})

// @desc Delete a  product 
// @route DELETE /api/products/:id
// @access Private admin

const deleteProduct=asyncHandler(async(req,res)=>{
    const product=await Product.findById(req.params.id)
    if(product){
        await product.remove()
        res.json({message:'Product Removed'})
    }
    else{
        res.status(404)
        throw new Error("Product not found")
    }
})



// @desc Create a  product 
// @route POST /api/products
// @access Private admin

const createProduct=asyncHandler(async(req,res)=>{
    const product=new Product({
        name:'Sample Name',
        price:0,
        user:req.user._id,
        image:'/images/sample.jpg',
        brand:'Sample brand',
        category: 'Sample Category',
        countInStock:0,
        numReviews:0,
        description:'Sample description'
    })
    const createdProduct=await product.save()

    res.status(201).json(createdProduct)
})


// @desc Update a  product 
// @route PUT /api/products/:id
// @access Private admin

const updateProduct=asyncHandler(async(req,res)=>{
    const {name,price,description,image,brand,category,countInStock}=req.body
    const product=await Product.findById(req.params.id)

    if(product){
        product.name=name
        product.price=price
        product.description=description
        product.image=image
        product.brand=brand
        product.category=category
        product.countInStock=countInStock
        const updatedProduct=await product.save()
        res.status(201).json(updatedProduct)
    } else{
        res.status(404)
        throw new Error("Product not Found")
    }
    
})


// @desc Create  new  review 
// @route PUT /api/products/:id/reviews
// @access Private

const createProductReview=asyncHandler(async(req,res)=>{
    const {rating,comment}=req.body
    const product=await Product.findById(req.params.id)


    if(product){
        const alreadyReviewd=product.reviews.find(r=>r.user.toString()===req.user._id.toString())
        if(alreadyReviewd){
            res.status(400)
            throw new Error("Product already reviewd")
        }
        // console.log("hello")
        // res.status(201).json(updatedProduct)
        const review={
            name: req.user.name,
            rating:Number(rating),
            comment,
            user:req.user._id
        }
        product.reviews.push(review)
        product.numReviews=product.reviews.length
        
        product.rating=product.reviews.reduce((acc,item)=>item.rating + acc,0)
        /product.reviews.length



        const updateProd=await product.save()

        // console.log("hello")
        // console.log("updatedProd: ",updateProd)

        res.status(201).json({message:'Review added'})

    } else{
        res.status(404)
        throw new Error("Product not Found")
    }
    
})


// @desc Get  top rated products 
// @route GET /api/products/top
// @access Public

const getTopProducts=asyncHandler(async(req,res)=>{
    const products=await Product.find({}).sort({rating:-1}).limit(5)

    res.json(products)
})


export {getTopProducts, getProductById,getProducts,deleteProduct,updateProduct,createProduct,createProductReview}