const mongoose=require('mongoose')

const userschema=mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    phoneno:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const usermodel=mongoose.model('User',userschema)
module.exports=usermodel