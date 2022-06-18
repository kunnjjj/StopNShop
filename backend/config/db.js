import mongoose from "mongoose";

const connectDB= async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log(`DB connected: ${conn.connection.host}`.cyan.underline)
    } catch(err){
        console.log("error ".red.underline.bold,err.message)
        process.exit(1)
    }
}

export default connectDB