const ethUtil = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");
import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require("uuid");

async function handler(req, res) {
  if (req.method == "POST") {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress)
      return res
        .status(400)
        .send({ error: "Request should have signature and publicAddress" });

    const client = await MongoClient.connect("mongodb://localhost:27017/NFT");

    const db = client.db();
    const users = db.collection("users");
    let user = await users.findOne({
      publicAddress: publicAddress,
    });

    // Step 1: Get the user with the given publicAddress
    if (!user)
      return res.status(401).send({
        error: `User with publicAddress ${publicAddress} is not found in database`,
      });

    // Step 2: Verify digital signature
    const msg = `I am signing my one-time nonce: ${user.nonce}`;

    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
    const address = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
    if (address.toLowerCase() != publicAddress.toLowerCase()) {
      return res.status(401).send({ error: "Signature verification failed" });
    }
    
    const user_id = user._id;
    let update_nonce = await users.findOneAndUpdate(
      {
        _id: user_id,
      },
      { $set: { nonce: uuidv4() } }
    );
    console.log(update_nonce);
    client.close();
    res.status(200).send({ message: "you are authenticated" });
  }
}

export default handler;
