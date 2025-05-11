Expense Tracker Application
This is a simple Expense Tracker application that allows users to track their income and expenses. The app enables users to add their transactions, view their current balance, and see a summary of income and expenses. Additionally, it displays a pie chart to visualize the income vs. expense data.

Features
Add Balance: Allows the user to add a balance to the account.

Add Transactions: Users can add income or expense transactions.

Transaction History: View all past transactions in a table.

Income & Expense Chart: Visualize income vs. expense with a pie chart.

Technologies Used
Frontend: HTML, CSS, JavaScript, Chart.js (for charts)

Backend: Node.js with Express

Database: MongoDB with Mongoose

How to Use
1. Start the Application
Clone the repository and set it up locally.

Run the server using Node.js, and the app will be available at http://localhost:3000.

2. Add Balance
Users can add balance to their account from the homepage.

3. Add Transactions
Users can add transactions by filling out the description, amount, and date.

Transactions can either be categorized as income or expense.

4. Transaction History
View all past transactions, including income and expenses, in a tabular format.

5. Income & Expense Chart
View income and expense data in a pie chart format to visually analyze your financial data.

File Structure
Here is an overview of the project structure:

php
Copy
Edit
expense-tracker/
│
├── models/
│   ├── balance.js         # Schema for balance collection
│   └── transaction.js     # Schema for transaction collection
│
├── public/
│   └── style.css          # CSS for styling the app
│
├── views/
│   ├── home.ejs           # Homepage template
│   ├── addBalance.ejs     # Add balance page template
│   ├── transactionHistory.ejs  # Transaction history page template
│   └── chart.ejs          # Chart page template
│
├── app.js                 # Main server file (Express app)
└── README.md              # Project documentation
How It Works
Adding Balance:

You can add balance to your account through the homepage. This balance is stored in the MongoDB database.

Adding Transactions:

You can add income or expense transactions by entering the description, amount, and date.

Each transaction is saved in the database.

Transaction History:

All transactions are listed on the Transaction History page, showing the date, description, and the amount categorized as income or expense.

Income & Expense Chart:

You can view your financial data visually with a pie chart that shows the total income and total expense.
