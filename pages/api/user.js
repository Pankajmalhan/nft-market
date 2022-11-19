import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require("uuid");

async function handler(req, res) {
  if (req.method == "POST") {
    const publicAddress = JSON.parse(req.body);
    const data = { publicAddress: publicAddress, nonce: uuidv4() };
    console.log(data);
    const client = await MongoClient.connect(
      "mongodb+srv://DbUser:12345@cluster0.wlidh.mongodb.net/NFTS"
    );

    const db = client.db();
    const users = db.collection("users");
    let user_details = await users.findOne({ publicAddress: publicAddress });
    if (!user_details) {
      console.log("hii from inside");
      const result = await users.insertOne(data);
      user_details = await users.findOne({ _id: result.insertedId });
    }
    client.close();
    res.status(201).json({ message: user_details });
  }
}

export default handler;
