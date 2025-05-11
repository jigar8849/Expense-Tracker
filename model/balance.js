const mongoose = require("mongoose");


const balanceSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : true
    },
    created_at : {
        type : Date,
        default : Date.now,
    }
});

module.exports = mongoose.model("Balance" , balanceSchema);