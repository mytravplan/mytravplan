import mongoose from 'mongoose'

let flightSchema=new mongoose.Schema({
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
        required:[true,'phone number is required']
    },
    date:{
        type:String,
        required:[true,'date is required']
    },
    origin:{
        type:String,
        required:[true,'origin field is required']
    },
    destination:{
        type:String,
        required:[true,'destination is required']
    },
    traveler:{
        type:Number,
        required:[true,'number of the traveler is required']
    },
    children:{
        type:Number,
        required:[true,'number of the children is required']
    },
    message:{
        type:String,
        required:[true,'at least write 10 character message']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
 
},{
    timestamps: true   
})

let FlightModel=mongoose.models.flights||mongoose.model('flights',flightSchema)
export default FlightModel