import dotenv from "dotenv";
dotenv.config();


import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getVariants, getProductsByCategory } from "../modules/varinats.js";


const router = express.Router();
router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const s3BucketName = process.env.S3_BUCKET_NAME;
const s3BucketRegion = process.env.S3_BUCKET_REGION;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretAccessKey,
  },
  region: s3BucketRegion,
});


router.get("/api/products", async (req, res) => {
  let categoryId = parseInt(req.query.categoryId, 10);
  console.log(categoryId);
    try {
      let products = [];
      let outputData = {};
  
      if(categoryId && categoryId !== 0){
        products = await getProductsByCategory(categoryId);
      }
      else{
        products = await getVariants();
      }
      function insertToData(product) {
          if(product.product_id in outputData){
              outputData[product.product_id].variants.push({
                  variant_id : product.variant_id,
                  price: product.price,
                  imageUrl : product.imageUrl,
                  details: product.details,
                  detailed_description: product.detailed_description,
              })
          }
          else
          {
              outputData[product.product_id] = {
                  product_id : product.product_id,
                  title : product.title,
                  weight : product.weight,
                  category_id : product.category_id,
                  default_price : product.default_price,
                  variants : [
                      {
                          variant_id : product.variant_id,
                          price: product.price,
                          imageUrl : product.imageUrl,
                          details: product.details,
                          detailed_description: product.detailed_description,
                      }
                  ]
              }
          }
      };
  
      for (let product of products) {
        let getObjectParams = {
          Bucket: s3BucketName,
          Key: product.image,
        };
  
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  
        product = {
          ...product,
          imageUrl : url,
        }
  
        insertToData(product);
      }
  
      res.status(200).send(outputData);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Error fetching products" });
    }
  });

export default router;
