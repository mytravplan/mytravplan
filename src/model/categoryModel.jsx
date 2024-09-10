import mongoose from "mongoose";

// Define the category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true   
});



const CategoryModel = mongoose.models.categories || mongoose.model('categories', categorySchema);

export default CategoryModel;
