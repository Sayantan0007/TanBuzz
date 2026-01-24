const mongoose = require('mongoose');

const coonectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=>console.log("Datbase connected"))
        await mongoose.connect(process.env.MONGODB_URL + "/tanbuzzDB");
    } catch (error) {
        console.log(error.message);
    }
     
}

module.exports = coonectDB;