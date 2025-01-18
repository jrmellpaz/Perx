import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI! as string);
    console.log('MongoDB successfully connected');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`ERROR: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
  }
};

export default connectDB;
