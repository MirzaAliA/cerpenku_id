const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        }
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    image: {
        profileImage: {
            type: String
        },
        backgroundImage: {
            type: String
        }
    },
    followingId: [{
        type: String
    }],
    followerId: [{
        type: String
    }],
    readingList: [{
        type: String
    }],
    workId: [{
        type: String
    }]
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema);

module.exports = User;