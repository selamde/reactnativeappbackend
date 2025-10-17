// const express = require("express");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();
app.use(ratelimiter);
app.use(cors());
//middleware to parse JSON request bodies
app.use(express.json());

const PORT = process.env.PORT;

// app.get("/", (req, res) => {
//   res.send("The server is running");
// });

// app.post("/api/transactions", async (req, res) => {
//   try {
//     //distructure
//     const { user_id, title, amount, category } = req.body;
//     if (!user_id || !title || !amount || !category) {
//       //400- bad request
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const transaction =
//       await sql`INSERT INTO transactions(user_id, title, amount, category)
//      VALUES(${user_id}, ${title},${amount}, ${category}) RETURNING *`;
//     //201 - created
//     console.log(transaction[0]);
//     res.status(201).json(transaction[0]);
//   } catch (error) {
//     console.log("Error creating transactions", error);
//     //500 - server error
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// app.get("/api/transactions/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     if (!userId) {
//       return res.status(400).json({ message: "id does not exit" });
//     }
//     const fetchTransactions =
//       await sql`SELECT * FROM transactions WHERE user_id = ${userId}
//     ORDER BY created_at DESC`;

//     res.status(200).json(fetchTransactions);
//   } catch (error) {
//     console.log("Error fetching transactions", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// app.delete("/api/transactions/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (isNaN(parseInt(id))) {
//       return res.status(400).json({ message: "Invalid transaction id" });
//     }
//     const result =
//       await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
//     if (result.length === 0) {
//       // 404 - not found
//       return res.status(404).json({ message: "Transaction not found" });
//     }
//     //200 - success
//     res.status(200).json({ message: "Transaction deleted successfully" });
//   } catch (error) {
//     console.log("Error deleting transactions", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// app.get("/api/transactions/summary/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     //if no transactions, return 0 ---> COLALESCE(sum(amount), 0)

//     const balanceResult = await sql`
//     SELECT COALESCE(sum(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
//     `;
//     const incomeResult = await sql`
//     SELECT COALESCE(sum(amount), 0) as income FROM transactions WHERE user_id = ${userId}
//     AND amount > 0
//     `;
//     const expenseResult = await sql`
//     SELECT COALESCE(sum(amount), 0) as expense FROM transactions WHERE user_id = ${userId}
//     AND amount < 0
//     `;
//     return res.status(200).json({
//       balance: balanceResult[0].balance,
//       income: incomeResult[0].income,
//       expense: expenseResult[0].expense,
//     });
//   } catch (error) {
//     console.log("Error fetching summary", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

app.use("/api/transactions", transactionsRoute);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
