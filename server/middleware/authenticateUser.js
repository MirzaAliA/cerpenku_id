const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(404).json({ message: 'User not allowed, token not found!' })
    }

    try{
        const user = jwt.verify(token, process.env.MY_SECRET);

        req.user = user;

        next();
    }
    catch (err) {
        res.clearCookie('token');
        console.error(err);
        return res.status(404).json({ message: 'You are logged out (authenticateUser.js)'})
    }
}

module.exports = authenticateUser;