import mongoose, { Connection } from "mongoose";

const DB_NAME = process.env.DB_NAME || "";
const DB_PASS = process.env.DB_PASS || "";
const DB_URI = `mongodb+srv://omega:${DB_PASS}@cluster0.nzhvgym.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Local cached connection
let cached: { conn: Connection | null; promise: Promise<Connection> | null } = {
  conn: null,
  promise: null,
};

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
      .then((mongoose) => mongoose.connection)
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;
