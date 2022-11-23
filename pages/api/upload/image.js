import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import nextConnect from "next-connect";
import multer from "multer";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmE3Y2ZkNS05ODAyLTQyYWEtYmNhOC02NGViNGFkNjNjMjYiLCJlbWFpbCI6InRpd2FyaWxhbGl0MjYwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjAxNDRjZmZmYzA0M2Q1ODY4MDgiLCJzY29wZWRLZXlTZWNyZXQiOiJhYjE5ZGVlYmM2NmYwMDhlZDE0ZjZjN2FlMTE4YWZkZjRjM2U1OWM0MmM3YWExODRkMGJlNTMwM2E1YjE4NmYzIiwiaWF0IjoxNjY5MjI0MTc5fQ.kTb19xDYFyi8YPXwu5Nb8UGk8Wnx9MrSRk4Ma3wKA0M";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "pages/api/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  try {
    const data = new FormData();
    console.log(req.file);
    const file = await fs.readFileSync(req.file.path);
    data.append("file", file, req.file.originalname);
    data.append("pinataOptions", '{"cidVersion": 1}');
    data.append(
      "pinataMetadata",
      '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}'
    );
    var config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      headers: {
        Authorization: `Bearer ${JWT}`,
        ...data.getHeaders(),
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };
    let ipfs_response = await axios(config);

    res.status(200).send({ data: ipfs_response.data.IpfsHash });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
