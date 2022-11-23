// const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const JWT = process.env.PINATA_JWT;
// const PINATA_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNWEyNDkyNy1kOTZiLTRlZDQtOWY0ZS01MjIzYzI3NTVhMGUiLCJlbWFpbCI6InNoaXZhbTAxN2Fyb3JhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2ZDVlMjA1MjFiMDZiMDgxMWQ0YiIsInNjb3BlZEtleVNlY3JldCI6ImRhNTM4NDAzNDcxNTkyZjA1ZmUyNTI2MTliOTNhNmYxNTJmNDg4ZGEwOTc4NzAzOTBhODI2M2YyYTE0ZWJmNDkiLCJpYXQiOjE2Njc5MzIyOTJ9.NsVN_Tjtw7SO6LH06IChG6EJjh-hyy1OaHCWWvSCL18"
async function storeImage() {
  var doc = document.querySelector("input[type=file]");
  var file = doc.files;
  // var file = doc.files[0];

  console.log(file);

  var data = new FormData();
  data.append("file", file);
  data.append("pinataOptions", '{"cidVersion": 1}');
  data.append(
    "pinataMetadata",
    '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}'
  );

  console.log(data);

  var config = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      Authorization: `Bearer ${JWT}`,
      ...data.getHeaders()
      // 'Content-Type': 'multipart/form-data'
    },
    data: data,
  };

  let res = await axios(config);

  console.log("IMAGE IPFS HASH: ", res.data.IpfsHash);

  var tokenUriMetadata = JSON.stringify({
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: "IpfsNFT",
    },
    pinataContent: {
      name: "IpfsNFT",
      keyvalues: {
        image: `ipfs://${res.data.IpfsHash}`,
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

  res = await axios(config);

  console.log(tokenUriMetadata);

  return res.data.IpfsHash;
}

module.exports = {
  storeImage,
};
