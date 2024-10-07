import mongoose from "mongoose";

 
const categoryCatyegorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true   
    }
}, {
    timestamps: true
});

 
const CategoryCategoryModel = mongoose.models.country_categories || mongoose.model('country_categories', categoryCatyegorySchema);

export default CategoryCategoryModel;
