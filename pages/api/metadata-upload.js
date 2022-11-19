import axios from "axios";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNWEyNDkyNy1kOTZiLTRlZDQtOWY0ZS01MjIzYzI3NTVhMGUiLCJlbWFpbCI6InNoaXZhbTAxN2Fyb3JhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2ZDVlMjA1MjFiMDZiMDgxMWQ0YiIsInNjb3BlZEtleVNlY3JldCI6ImRhNTM4NDAzNDcxNTkyZjA1ZmUyNTI2MTliOTNhNmYxNTJmNDg4ZGEwOTc4NzAzOTBhODI2M2YyYTE0ZWJmNDkiLCJpYXQiOjE2Njc5MzIyOTJ9.NsVN_Tjtw7SO6LH06IChG6EJjh-hyy1OaHCWWvSCL18";

async function handler(req, res) {
  if (req.method == "POST") {
    console.log(req.body);
    const tokenUriMetadata = JSON.parse(req.body);
    var config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      headers: {
        Authorization: `Bearer ${JWT}`,
        // ...data.getHeaders(),
        "Content-Type": "application/json",
      },
      data: tokenUriMetadata,
    };
    let ipfs_response = await axios(config);
    console.log(ipfs_response.data.IpfsHash);
    res.status(200).send({ data: ipfs_response.data.IpfsHash });
  }
}

export default handler;
