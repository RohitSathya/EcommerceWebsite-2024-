const mongoose=require('mongoose')
const cartSchema=mongoose.Schema({

    name:{
        type:String
    },
    price:{
        type:String
    },
    category:{
        type:String
    },
    image:{
        type:String
    },
    uid:{
        type:String
    }
},{
    timestamps:true
})
const cartModel=mongoose.model('Cart',cartSchema)
module.exports=cartModel