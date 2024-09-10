import mongoose from "mongoose";
import PackagesModel from "./packagesModel";

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

// Define the cities schema with references to packages
const CitiesSchema = new mongoose.Schema({
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
    all_packages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'packages',
          index: true 
        },
    ],
    all_activities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'activities',
          index: true 
        },
    ],
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'countries',
        index: true 
       
    }
},{
    timestamps: true   
});

// Create the cities model
let CitiesModel = mongoose.models.cities || mongoose.model('cities', CitiesSchema);

export default CitiesModel;
