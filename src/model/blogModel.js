import mongoose from "mongoose";
import CategoryModel from "./categoryModel"; 
 

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
const blogsItemSchema = new mongoose.Schema({
    content: { type: String, required: true }
});
 
const blogSchema = new mongoose.Schema({
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
    blog_overview:{
        type:String,
        required:true
        
    },
    blog_galleries: [imageSchema], 
    blog_description:[blogsItemSchema],
    sco_title:{type: String, default: null},
    sco_description:{type: String, default: null},
    sco_host_url:{type: String, default: null},
    blog_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
     
});


 

let BlogModel = mongoose.models.blogs || mongoose.model('blogs', blogSchema);

export default BlogModel;
