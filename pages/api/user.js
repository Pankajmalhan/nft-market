import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require("uuid");

async function handler(req, res) {
  if (req.method == "POST") {
    let publicAddress = JSON.parse(req.body);
    publicAddress = publicAddress.toLowerCase();
    const data = {
      publicAddress: publicAddress,
      nonce: uuidv4(),
    };
    console.log(data);
    const client = await MongoClient.connect(
      "mongodb+srv://DbUser:12345@cluster0.wlidh.mongodb.net/NFTS"
    );

    const db = client.db();
    const users = db.collection("users");

    let user_details = await users.findOne({ publicAddress: publicAddress });

    if (!user_details) {
      const result = await users.insertOne(data);
      user_details = await users.findOne({ _id: result.insertedId });
    } else {
      user_details = await users.findOneAndUpdate(
        {
          _id: user_details._id,
        },
        { $set: { nonce: uuidv4() } }
      );

      user_details = user_details.value;
    }
    client.close();
    res.status(201).json({ message: user_details });
  }
}

export default handler;
