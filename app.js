require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');



const app = express();
const port = 3000 || process.env.port;


//Database connection
connectDB();


app.get('')



app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})