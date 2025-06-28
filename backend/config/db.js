import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, );
    console.log("MongoDb Connected");
  } catch (error) {
    console.log("Error Connecting DB: ", error);
  }
};

export default connectDb
