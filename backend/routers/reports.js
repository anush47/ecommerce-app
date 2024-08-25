import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import {
  getQuarterlySales,
  getTopSellingProduct,
  getMostSellingCategoryId,
  getCategoryHierarchy,
  getPeakInterestPeriod,
} from "../modules/reports.js";

const router = express.Router();
router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/api/reports/quartely-sales", async (req, res) => {
  try {
    const { selectedYear } = req.body;
    if (!selectedYear) {
      return res.status(400).send({ error: "selectedYear is required" });
    }

    const results = await getQuarterlySales(selectedYear);
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/api/reports/top-selling", async (req, res) => {
  const { start_date, end_date } = req.body;
  try {
    const results = await getTopSellingProduct(start_date, end_date);
    console.log(results);
    res.status(200).send(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting top-selling product");
  }
});

router.get("/api/reports/most-selling-category", async (req, res) => {
  try {
    const categoryId = await getMostSellingCategoryId();
    if (!categoryId) {
      return res.status(404).send("Most selling category not found");
    }
    const hierarchy = await getCategoryHierarchy(categoryId);
    res.status(200).send(hierarchy);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving most selling category hierarchy");
  }
});

router.get('/api/reports/peak-interest-period/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
      const data = await getPeakInterestPeriod(productId);
      res.status(200).send(data[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

export default router;
