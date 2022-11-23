import axios from "axios";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmE3Y2ZkNS05ODAyLTQyYWEtYmNhOC02NGViNGFkNjNjMjYiLCJlbWFpbCI6InRpd2FyaWxhbGl0MjYwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjAxNDRjZmZmYzA0M2Q1ODY4MDgiLCJzY29wZWRLZXlTZWNyZXQiOiJhYjE5ZGVlYmM2NmYwMDhlZDE0ZjZjN2FlMTE4YWZkZjRjM2U1OWM0MmM3YWExODRkMGJlNTMwM2E1YjE4NmYzIiwiaWF0IjoxNjY5MjI0MTc5fQ.kTb19xDYFyi8YPXwu5Nb8UGk8Wnx9MrSRk4Ma3wKA0M";

async function handler(req, res) {
  if (req.method == "POST") {
    var tokenUriMetadata = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: "IpfsNFT",
      },
      pinataContent: {
        title: req.body.title,
        description: req.body.desc,
        image: `ipfs://${req.body.imgHash}`,
        keyvalues: {
          attack: req.body.attack,
          speed: req.body.speed,
          health: req.body.health,
        },
      },
    });

    var config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      data: tokenUriMetadata,
    };

    const response = await axios(config);

    res.status(200).send({ data: response.data.IpfsHash });
  }
}

export default handler;
