import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { insertOrder, getDistinctOrderYears, getOrderDetails, getOrderItems } from "../modules/orders.js";

const router = express.Router();
router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/api/insert-order', async (req, res) => {
    try {
      const { customer_id, total_amount, delivery_method, payment_method, order_date, delivery_estimate, cart_id } = req.body;
      console.log(payment_method);
      const result = await insertOrder({ customer_id, total_amount, delivery_method, payment_method, order_date, delivery_estimate, cart_id });
      res.status(201).json({ message: 'Order inserted successfully', orderId: result.insertId });
    } catch (error) {
      console.error('API error:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  router.get('/api/orders/years', async (req, res) => {
    console.log('Called');
    try {
      const years = await getDistinctOrderYears();
      console.log(years);
      res.status(200).send(years);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

  router.get('/api/orders', async (req, res) => {
    try {
      const data = await getOrderDetails();
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  router.get('/api/order-items/:orderId', async (req, res) => {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).send('Order ID is required');
    }
  
    try {
      const orderDetails = await getOrderItems(orderId);
      res.json(orderDetails);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

export default router;


