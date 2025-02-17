import { MongoClient } from 'mongodb';
import { NODE_ENV, MONGODB_URI } from '$env/static/private';

if (!MONGODB_URI) {
 throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (NODE_ENV === 'development') {
 if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
 }
 clientPromise = global._mongoClientPromise;
} else {
 client = new MongoClient(uri, options);
 clientPromise = client.connect();
}

export default clientPromise;