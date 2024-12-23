require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const Work = require('./server/models/WorkSchema');
const User = require('./server/models/UserSchema');
const authenticateUser = require('./server/middleware/authenticateUser');
const logoutUser = require('./server/middleware/logoutUser');
const bcrypt = require('bcrypt');
const ObjectId = require("mongodb").ObjectId



const app = express();
const port = 3000 || process.env.port;


//Database connection
connectDB();


app.get('')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// REGISTER ACCOUNT
app.post('/api/auth/register', async (req, res) => {
    try{
        const { email, username, password, name, description, location, profileImage, backgroundImage } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email field is required" });
        } else if (!username) {
            return res.status(400).json({ message: "Username field is required" });
        } else if (!name) {
            return res.status(400).json({ message: "Name field is required" });
        } 

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const fullName = name.trim().split(' ');
        const firstName = fullName[0];
        const lastName = fullName.slice(1).join(' ');

        const newUser = { email, username, password: hashedPassword, name: {firstName, lastName: lastName || ''}, description, location, profileImage, backgroundImage };

        const Users = await User.create(newUser);

        if (Users) {
            return res.status(201).json({ message: 'Register successfull' });
        }
        res.status(500).json({ message: 'Failed to register' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// EDIT ACCOUNT INFO
app.patch('/api/auth/edit-account', authenticateUser, async (req, res) => {
    try{
        const userEmail = req.user.email;
        
        const { description, location, profileImage, backgroundImage } = req.body;
        const payload = { description: description, location: location, profileImage: profileImage, backgroundImage: backgroundImage};
        const userUpdatedAccount = await User.updateOne({ email: userEmail }, payload);

        if(userUpdatedAccount) {
            return res.status(201).json({ message: 'User info updated successfull' });
        }
        return res.status(500).json({ message: 'Failed to update User info'});
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error'});
    }
})


// LOGIN ACCOUNT
app.post('/api/auth/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const payload = { _id: user._id, username: user.username, email, password };

        if (user) {
            if (email && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign(payload, process.env.MY_SECRET, { expiresIn: '1h' });

                res.cookie('token', token, {
                    httpOnly: true
                })

                return res.status(201).json({ token, message: 'Login successfull' });
            } else {
                return res.send({ message: 'User not allowed' });
            }
        } else {
            return res.status(500).json({ message: 'User not found' })
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

//LOGOUT ACCOUNT
app.post('/api/auth/logout', logoutUser, async (req, res) => {
    res.redirect('/api');
})


// GET ALL WORKS
app.get('/api/work', authenticateUser, async (req, res) => {
    try{
        const Works = await Work.find();
        if (Works) {
            return res.json(Works);
        }
        res.status(500).json({ message: 'Failed to load data' })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// HOME PAGE
// app.get('/api/home', async (req, res) => {
//     try{
        
//     }
//     catch (err) {
//         console.error(err);
//     }
// })

// GET WORKS FILTER BY GENRE
app.get('/api/genre/:genre', async (req, res) => {
    try{
        const genre = req.params.genre;
        const workByGenre = await Work.aggregate([
            {
                $match: {
                    category: genre
                }
            }
        ])
        if (workByGenre) {
            return res.status(200).json(workByGenre);
        }
        res.status(500).json({ message: 'Failed to load data' })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// GET WORKS FILTER BY SEARCH TITLE
app.get('/api/search', async (req, res) => {
    try{
        console.log(req.query.query)
    }
    catch (err) {
        console.error(err);
    }
})

// GET ONE WORK BY ID
app.get('/api/work/:id', authenticateUser, async (req, res) => {
    try{
        const id = req.params.id;
        const Works = await Work.findOne({ _id: id });
        if (Works) {
            return res.json(Works);
        }
        res.status(500).json({ message: 'Failed to query data' })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// ADDING ONE WORK
app.post('/api/work', authenticateUser, async (req, res) => {
    try{
        const authorId = req.user._id;
        const { title, body, category, tags, targetAudience, language, rating, image } = req.body;
        const newWork = { authorId, title, body, category, tags, targetAudience, language, rating, image };

        const Works = await Work.create(newWork);

        const updateUser_WorkId = await User.updateOne({ _id: authorId }, { $push: {workId: Works._id }})

        if (updateUser_WorkId) {
            return res.status(201).json({ message: 'Data stored successfull' });
        }
        res.status(500).json({ message: 'Failed to store data' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// DELETE ONE WORK BY ID
app.delete('/api/work/:id', authenticateUser, async (req, res) => {
    try{
        const id = req.params.id;
        const Works = await Work.deleteOne({ _id: id });

        if (Works) {
            return res.status(201).json({ message: 'Data deleted successfull' });
        }
        res.status(500).json({ message: 'Failed to delete data' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// UPDATE ONE WORK BY ID
app.patch('/api/work/:id', authenticateUser, async (req, res) => {
    try{
        const { title, body, category, tags, targetAudience, language, rating, image } = req.body;
        const updatedWork = { title, body, category, tags, targetAudience, language, rating, image };

        const id = req.params.id;

        const Works = await Work.updateOne({ _id: id }, updatedWork);

        if (Works) {
            return res.status(201).json({ message: 'Data updated successfull' });
        }
        res.status(500).json({ message: 'Failed to update data' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// GET USER's INFO
app.get('/api/user/:username')

// GET ALL USER's WORKS
app.get('/api/user-with-works', authenticateUser, async (req, res) => {
    try{
        const idUser = req.user._id;
        const result = await User.aggregate([
            {
                $match: {
                    _id: new ObjectId(`${idUser}`)
                }
            },
            {
                $project: {
                    name: 1,
                    location: 1,
                }
            },
            {
                $lookup: {
                    from: 'works',
                    localField: '_id',
                    foreignField: 'authorId',
                    as: 'works'
                }
            }
        ])

        if (result) {
            return res.status(200).json(result);
        }
        res.status(404).json({ message: 'No data found' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
})



app.get('/api/home', authenticateUser, async (req, res) => {
    res.send('You are accessing homepage using token')
})

app.get('/api', async (req, res) => {
    res.send({ message: 'You are logged out(app.js)' })
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})