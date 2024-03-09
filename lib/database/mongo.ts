import mongoose, { Mongoose } from "mongoose";

// Get MongoDB host from environment variables
const MONGO_DB_HOST = process.env.MONGO_DB_HOST;

// Interface for Mongoose connection object
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Cached connection object
let cached: MongooseConnection = (global as any).mongoose;

// If no cached connection exists, create a new one
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

// Function to connect to the MongoDB database
export const connectToDatabase = async () => {
  // If connection already exists, return it
  if (cached.conn) return cached.conn;

  // Throw error if MongoDB host is not provided
  if (!MONGO_DB_HOST) throw new Error("Missing MONGODB_URL");

  // If no promise exists, create a new one by connecting to the MongoDB database
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGO_DB_HOST, {
      dbName: "SAAS-APP", // Database name
      bufferCommands: false, // Disable command buffering
    });

  // Await the promise and set the connection object in the cache
  cached.conn = await cached.promise;

  // Return the connection object
  return cached.conn;
};
