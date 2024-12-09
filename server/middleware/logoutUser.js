const logoutUser = (req, res, next) => {
    try{
        res.clearCookie('token');
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to logout' })
    }
}

module.exports = logoutUser;