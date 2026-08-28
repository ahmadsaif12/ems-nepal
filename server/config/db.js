import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = () => {
    if (!connectionPromise) {
        mongoose.connection.on('connected', () => console.log("DB Connected"));
        connectionPromise = mongoose.connect(process.env.MONGODB_URI);
    }
    return connectionPromise;
};

export default connectDB;