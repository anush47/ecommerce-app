import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { setCartAndCartItems, getCartItems } from "../modules/cart.js";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getVariants } from "../modules/varinats.js";


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


router.post('/api/create-cart', async (req, res) => {
    try {
      const customer_id = req.body.customer_id;
      const cart_items = req.body.cart_items;
      
      const cartDetails = await setCartAndCartItems(customer_id, cart_items);
      
      res.status(200).json({
        message: 'Cart created successfully',
        data: cartDetails
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  
  router.post('/api/cart-items', async (req, res) => {
    let outItems = [];
    let totalAmount = 0;
    let deliveryEstimate = 0;
    try {
      const { cartId } = req.body;
      if (!cartId) {
        return res.status(400).json({ error: 'cartId is required' });
      }
      const items = await getCartItems(cartId);

      for(let item of items){
        let getObjectParams = {
          Bucket: s3BucketName,
          Key: item.image,
        };
  
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        totalAmount += parseFloat(item.price);
        deliveryEstimate = item.deliveryEstimate;

        item = {
          ...item,
          imageUrl : url,
        }

        outItems.push(item);
      }
      console.log(totalAmount);
      res.json({items : outItems, totalAmount : totalAmount, deliveryEstimate : deliveryEstimate});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;


