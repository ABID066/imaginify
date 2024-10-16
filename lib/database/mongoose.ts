import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Augment the Node.js Global type to include `mongoose`
declare global {
    // eslint-disable-next-line
    var mongoose: MongooseConnection | undefined;  // Use `let` instead of `var`
}

// Use the augmented global type here
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URI) throw new Error('Mongoose URI must be provided');

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'imaginify',
        bufferCommands: false,
    });

    cached.conn = await cached.promise;
    return cached.conn;
};
