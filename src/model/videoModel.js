import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,  
        required: true,
    }
}, { timestamps: true });

const VideosModel = mongoose.models.videos || mongoose.model('videos', VideoSchema);
export default VideosModel;
