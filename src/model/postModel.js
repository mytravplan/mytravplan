const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    showOnNewTest: {
        type: Boolean,
        default: false,   
    }
}, { timestamps: true });

const PostModel = mongoose.models.posts|| mongoose.model('posts', PostSchema);

module.exports = PostModel;
