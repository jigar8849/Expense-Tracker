const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Balance = require("./model/balance");
const Transaction = require("./model/transaction");

main()
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    await mongoose.connect("mongodb://localhost:27017/moneyTracker");
}

let bal = new Balance({
    amount : 10000,
    created_at : Date.now()
})
// bal.save().then(()=>{
//     console.log("Data saved");
// }).catch((err)=>{
//     console.log(err);
// })

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // This is necessary to parse JSON in POST requests



app.get("/", async (req, res) => {
    try {
        // Fetch the latest balance (sorted by `created_at` field)
        const latestBalance = await Balance.findOne().sort({ created_at: -1 });

        // If no balance exists, default to 0
        const balanceAmount = latestBalance ? latestBalance.amount : 0;

        // Render the homepage and pass only the amount to the view
        res.render("home.ejs", { balance: balanceAmount });
    } catch (err) {
        console.log(err);
        res.render("home.ejs", { balance: 0 }); // Show 0 if there's an error
    }
});



app.get("/add-balance",(req,res)=>{
    res.render("addBalance.ejs");
})

app.get("/transaction-history", async (req, res) => {
  try {
    // Fetch all transactions from the database, sorted by the most recent
    const transactions = await Transaction.find().sort({ date: -1 });

    // You can also fetch the balance if needed
    const latestBalance = await Balance.findOne().sort({ created_at: -1 });

    // Pass transactions and the latest balance to the view
    res.render("transactionHistory.ejs", {
      transactions,
      currentBalance: latestBalance ? latestBalance.amount : 0
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading transaction history");
  }
});


app.post("/add-balance", async (req, res) => {
  console.log("Request Body:", req.body); // 👈 Debug line

  const { amount } = req.body;

  try {
    // Check if there is already a balance document
    const latestBalance = await Balance.findOne().sort({ created_at: -1 });

    if (latestBalance) {
      // Update the existing balance
      latestBalance.amount += parseFloat(amount);
      await latestBalance.save();
    } else {
      // Create a new balance document if none exists
      const newBalance = new Balance({
        amount: parseFloat(amount),
      });
      await newBalance.save();
    }

    res.redirect("/"); // Redirect back to the homepage after saving
  } catch (err) {
    console.log(err);
    res.send("Error saving balance");
  }
});



app.post("/add-transaction", async (req, res) => {
  try {
    const { description, amount, date, type } = req.body;

    if (!description || !amount || !date || !type) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const parsedAmount = parseFloat(amount);

    // Save the transaction
    const newTransaction = new Transaction({ description, amount: parsedAmount, date, type });
    await newTransaction.save();

    // Update latest balance
    const latestBalance = await Balance.findOne().sort({ created_at: -1 });
    if (latestBalance) {
      if (type === 'income') {
        latestBalance.amount += parsedAmount;
      } else {
        latestBalance.amount -= parsedAmount;
      }
      await latestBalance.save();
    }

    // Calculate total income and expense
    const incomeAgg = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const expenseAgg = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpense = expenseAgg[0]?.total || 0;

    res.json({
      success: true,
      newBalance: latestBalance.amount.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});



app.get("/chart", async (req, res) => {
  try {
    // Fetch all transactions (income and expense)
    const transactions = await Transaction.find().sort({ date: -1 });

    // Calculate total income and expense
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpense += transaction.amount;
      }
    });

    // Pass the data to the chart view
    res.render("chart.ejs", { totalIncome, totalExpense, transactions });
  } catch (err) {
    console.error(err);
    res.send("Error loading chart data");
  }
});



















app.listen(3000,()=>{
    console.log("server is running on port 3000");
});
