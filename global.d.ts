import mongoose from "mongoose";

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: mongoose.Connection | null; // Properly typed connection
        promise: Promise<mongoose.Connection> | null; // Promise resolving to the connection
      };
    }
  }
}
