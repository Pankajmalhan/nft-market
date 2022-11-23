import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require("uuid");

async function handler(req, res) {
  if (req.method == "POST") {
    //Mongo DB connection
    const client = await MongoClient.connect(
      "mongodb+srv://DbUser:12345@cluster0.wlidh.mongodb.net/NFTS"
    );
    const db = client.db();
    const users = db.collection("users");

    const { address: publicAddress } = req.body;

    //If User Exists
    let user_details = await users.findOne({ publicAddress: publicAddress });
    const nonce = uuidv4();
    if (user_details) {
      user_details = await users.findOneAndUpdate(
        {
          _id: user_details._id,
        },
        { $set: { nonce: nonce } }
      );
      user_details = user_details.value;
    } else {
      const result = await users.insertOne({
        publicAddress: publicAddress,
        nonce: nonce,
      });
      user_details = await users.findOne({ _id: result.insertedId });
    }
    client.close();
    res.status(201).json({ publicAddress: publicAddress, nonce: nonce });
  }
}

export default handler;
