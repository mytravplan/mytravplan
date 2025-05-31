import mongoose from 'mongoose';

const connection = {};

export const DbConnect = async () => {
  console.log(process.env.NEXT_PUBLIC_MONGO_URL)
  if (connection.isConnected) {

    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {

      return;
    }

    await mongoose.disconnect();

  }

  const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL);

  connection.isConnected = db.connections[0].readyState;

};
