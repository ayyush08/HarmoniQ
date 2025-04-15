
import mongoose from "mongoose";

export async function connectDB() {
    try {

        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection
        connection.on('connected', () => {
            console.log("MongoDB connected");
        })
        connection.on('error', (err:any) => {
            console.log('MongoDB connection error, Please check your database' + err);
            process.exit()
        })
    } catch (error) {
        console.log('Failed to connect Database');
        console.log(error);


    }
}