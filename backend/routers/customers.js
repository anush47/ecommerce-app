import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { getCustomers } from "../modules/customers.js";

const router = express.Router();
router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/api/customers", async (req, res) => {
  try {
    const customers = await getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
