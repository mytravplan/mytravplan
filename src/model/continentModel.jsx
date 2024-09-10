import mongoose from "mongoose";
import countriesModel from "./countryModel";
 



// Define the image schema
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
    }
});

// Define the continent schema with references to countries
const continentSchema = new mongoose.Schema({
    images: [imageSchema],
    title: {
        type: String,
        required: true  
    },
    description: {
        type: String,
        required: true  
    },
    slug:{
        type:String,
        required:true
        
    },
    all_countries: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'countries',
          index: true 
        },
    ],
     
},{
    timestamps: true   
});


// Create the continent model



let continentModel = mongoose.models.continents || mongoose.model('continents', continentSchema);

export default continentModel;
