import mongoose from "mongoose";


const DB_NAME = process.env.DB_NAME || ""; // Fetch MongoDB URI from the environment variables
const DB_PASS = process.env.DB_PASS || ""; // Fetch MongoDB URI from the environment variables
const DB_URI = `mongodb+srv://omega:${DB_PASS}@cluster0.nzhvgym.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`; // Add your MongoDB URI here


if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Create a cached connection object in the global scope
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(DB_URI, opts)
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;
