import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    contentType: { type: String, required: true },
});

const videoSchema = new mongoose.Schema({ // New schema for videos
    name: { type: String, required: true },
    path: { type: String, required: true },
    contentType: { type: String, required: true },
});

const testimonialSchema = new mongoose.Schema({
    images: [imageSchema],
    videos: [videoSchema], // New field for videos
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    }
}, {
    timestamps: true
});

const TestimonialsModel = mongoose.models.testimonials || mongoose.model('testimonials', testimonialSchema);

export default TestimonialsModel;
