const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        const conn = await mongoose.connect("mongodb+srv://ladeeda:1234@co-work-space.p4wrvcn.mongodb.net/?retryWrites=true&w=majority");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Handle error (e.g., throw an error, exit the process)
        process.exit(1);
    }
}

module.exports = connectDB;