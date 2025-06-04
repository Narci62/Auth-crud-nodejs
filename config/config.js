module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || 'mysecret',
        expiresIn: process.env.EXPIRES_IN || '1h'
    },
    server : {
        port : process.env.PORT || 5000
    }
};