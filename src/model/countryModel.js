import mongoose from "mongoose";
import CitiesModel from "./citiesModel";
import PackagesModel from "./packagesModel"; 
import CategoryCategoryModel from "./countryCategories";
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
    },
    
},{
    timestamps: true   
});

// Define the country schema with references to cities, packages, and continent
const countrySchema = new mongoose.Schema({
    images: [imageSchema],
    title: {
        type: String,
        required: [true,'title is required']  
    },
    description: {
        type: String,
        required: [true,'description is required']   
    },
    slug:{
        type:String,
        required: [true,'slug is required']  
    },
    sco_title:{type: String, default: null},
    sco_description:{type: String, default: null},
    sco_host_url:{type: String, default: null},
    all_cities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'cities',
          index: true 
        },
    ],
    all_packages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'packages',
          index: true 
        },
    ],
    continent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'continents',
        index: true 
    },
    country_categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'country_categories'  
        }
    ],
    isShow:{
        type: Boolean, default: false   
    }
});

// Create the country model
let countriesModel = mongoose.models.countries || mongoose.model('countries', countrySchema);

export default countriesModel;
