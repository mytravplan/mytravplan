import mongoose from "mongoose";
import CitiesModel from "./citiesModel"; 
import countriesModel from "./countryModel";
import continentModel from "./continentModel";
// Define the image schema
const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    contentType: { type: String, required: true },
     
    
});


// Define the package schema
const activitiesSchema = new mongoose.Schema({
    images: [imageSchema],
    icon:[imageSchema],
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    activity_price:{type: String, required: true},
    activity_discounted_price:{type: String, required: true},
    activity_overview: { type: String, required: true },
    activity_top_summary: { type: String, required: true },
    activity_galleries: [imageSchema],  
    sco_title:{type: String, default: null},
    sco_description:{type: String, default: null},
    sco_host_url:{type: String, default: null},
    city_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cities',
        required: true,
        index: true 
    }
},{
    timestamps: true   
});

// Create the package model
const ActivitiesModel = mongoose.models.activities || mongoose.model('activities', activitiesSchema);
export default ActivitiesModel;
