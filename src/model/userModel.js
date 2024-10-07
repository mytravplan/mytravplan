import mongoose from 'mongoose'

let contactUsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    phone_number:{
        type:Number,
        required:[true,'phone numnber is required']
    },
    message:{
        type:String,
    }
},{
    timestamps: true   
})

let ContactModel=mongoose.models.users||mongoose.model('users',contactUsSchema)
export default ContactModel