const ethUtil = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");
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

    console.log(req.body);

    const { publicAddress, signature } = req.body;

    const user = await users.findOne({
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
      res.status(401).send({ error: "Signature verification failed" });
    } else {
      res.status(200).send({ message: "you are authenticated" });
    }
  }
}

export default handler;
