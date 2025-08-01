import mongoose from 'mongoose'

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected locally')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  }
}

export default connectToMongoDb
