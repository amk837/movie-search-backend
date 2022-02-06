const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    environment: process.env.NODE_ENV,
}