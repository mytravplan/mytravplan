import mongoose from "mongoose";
import PackagesModel from "./packagesModel";
// Define the category schema

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
const PackageCategorySchema = new mongoose.Schema({

    image:[imageSchema],
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true 
    },
   

    
},{
    timestamps: true   
});

const PackageCategoryModel = mongoose.models.packages_categories || mongoose.model('packages_categories', PackageCategorySchema);

export default PackageCategoryModel;
