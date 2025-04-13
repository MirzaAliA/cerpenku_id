const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        titlePart: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    targetAudience: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    likesBy: [{
        type: String,
    }],
    comments: [{
        user_id: {
            type: String
        },
        comment: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    viewsCount: {
        type: Number,
        min: 0
    },
    image: {
        type: String
    },
}, {
    timestamps: true
})

const Work = mongoose.model('Work', WorkSchema);

module.exports = Work;