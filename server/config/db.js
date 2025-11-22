import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // The Mongoose connection method takes the MongoDB URI and an options object
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        
        // Exit the process with failure code
        process.exit(1); 
    }
};

export default connectDB;

// Note: Ensure your .env file has the line: 
// MONGO_URI="mongodb+srv://<username>:<password>@<clustername>.mongodb.net/<dbname>?retryWrites=true&w=majority"