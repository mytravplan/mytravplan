import mongoose from 'mongoose'

let imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    
});

let SliderSchema=new mongoose.Schema({

    galleries: [imageSchema],

})

const SliderModel=mongoose.models.sliders||mongoose.model('sliders',SliderSchema)

 

export default SliderModel