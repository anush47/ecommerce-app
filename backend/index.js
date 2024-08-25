import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import products from './routers/products.js'
import users from './routers/users.js'
import cart from './routers/cart.js'
import order from './routers/orders.js'
import menu from './routers/menu.js'
import reports from './routers/reports.js'
import customers from './routers/customers.js'

const app = express();
app.use(cors());


app.use(products);
app.use(users);
app.use(cart);
app.use(order);
app.use(menu);
app.use(reports);
app.use(customers);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
