import mongoose from "mongoose";
import CitiesModel from "./citiesModel"; 
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
