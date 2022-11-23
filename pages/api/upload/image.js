import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import nextConnect from "next-connect";
import multer from "multer";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNWEyNDkyNy1kOTZiLTRlZDQtOWY0ZS01MjIzYzI3NTVhMGUiLCJlbWFpbCI6InNoaXZhbTAxN2Fyb3JhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2ZDVlMjA1MjFiMDZiMDgxMWQ0YiIsInNjb3BlZEtleVNlY3JldCI6ImRhNTM4NDAzNDcxNTkyZjA1ZmUyNTI2MTliOTNhNmYxNTJmNDg4ZGEwOTc4NzAzOTBhODI2M2YyYTE0ZWJmNDkiLCJpYXQiOjE2Njc5MzIyOTJ9.NsVN_Tjtw7SO6LH06IChG6EJjh-hyy1OaHCWWvSCL18";

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
