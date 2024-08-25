import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { buildNestedCategories, fetchCategories } from "../modules/menu.js";

const router = express.Router();
router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/api/menu', async (req, res) => {
    try {
        const categories = await fetchCategories();
      const result = buildNestedCategories(categories);
      res.status(201).json(result);
    } catch (error) {
      console.error('API error:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

export default router;


