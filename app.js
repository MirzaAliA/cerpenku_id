require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('./server/config/db');
const Work = require('./server/models/WorkSchema');
const User = require('./server/models/UserSchema');



const app = express();
const port = 3000 || process.env.port;


//Database connection
connectDB();


app.get('')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));







// GET ALL WORKS
app.get('/work', async (req, res) => {
    try{
        const Works = await Work.find();
        if (Works) {
            return res.send(Works);
        }
        res.status(500).send({ message: 'Failed to query data' })
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' })
    }
})

// GET ONE WORK BY ID
app.get('/work/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const Works = await Work.findOne({ _id: id });
        if (Works) {
            return res.send(Works);
        }
        res.status(500).send({ message: 'Failed to query data' })
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' })
    }
})

// ADDING ONE WORK
app.post('/work', async (req, res) => {
    try{
        const { title, body, category, tags, targetAudience, language, rating, image } = req.body;
        const newWork = { title, body, category, tags, targetAudience, language, rating, image };

        const Works = await Work.create(newWork);

        if (Works) {
            return res.status(201).send({ message: 'Data stored successfull' });
        }
        res.status(500).send({ message: 'Failed to store data' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
})

// DELETE ONE WORK BY ID
app.delete('/work/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const Works = await Work.deleteOne({ _id: id });

        if (Works) {
            return res.status(201).send({ message: 'Data deleted successfull' });
        }
        res.status(500).send({ message: 'Failed to delete data' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
})

// UPDATE ONE WORK BY ID
app.patch('/work/:id', async (req, res) => {
    try{
        const { title, body, category, tags, targetAudience, language, rating, image } = req.body;
        const updatedWork = { title, body, category, tags, targetAudience, language, rating, image };

        const id = req.params.id;

        const Works = await Work.updateOne({ _id: id }, updatedWork);

        if (Works) {
            return res.status(201).send({ message: 'Data updated successfull' });
        }
        res.status(500).send({ message: 'Failed to update data' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})