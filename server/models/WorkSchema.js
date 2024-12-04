const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    authorId: {
        type: String
    },
    category: {
        type: String
    },
    title: {
        type: String
    },
    tags: [{
        type: String
    }],
    targetAudience: {
        type: String
    },
    language: {
        type: String
    },
    rating: {
        type: String
    },
    likesBy: [{
        type: String,
    }],
    likesBy: {
        type: Number,
        min: 0
    },
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