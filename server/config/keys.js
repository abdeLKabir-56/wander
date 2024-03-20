require('dotenv').config();

module.exports = {
    google :{
        clientID: process.env.clientID_Google,
        ClientSecret: process.env.ClientSecret_Google
    },
    facebook :{
        clientID: process.env.clientID_Facebook,
        ClientSecret: process.env.ClientSecret_Facebook
    },
    session:
    {
        cookieKey:process.env.cookieKey
    }
};