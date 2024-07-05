import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connect = async () => {
    const MONGO_URI = process.env.MONGO_URI || "";
    try {
        await mongoose.connect(`${MONGO_URI}/RAG`);
    }
    catch (error) {
        console.log(error);
    }
};
export default connect;