const mongoose = require("mongoose");
const shortid = require("shortid");

var userProfileSchema = new mongoose.Schema({
    location: {type: String, default: ""},
    bio: {type: String, default: ""},
    profile_pic: {type: String, default: "default_profile.png"}
})

var walletSchema = new mongoose.Schema({
    pubkey: {type: String, default: ""},
    balance: {type: Number, default: 0}
})

var userSchema = new mongoose.Schema({
    name: {type:String},
    username: {type:String},
    email: {type:String},
    password: {type:String},
    member_id: {type:String, default: shortid.generate},
    friends: [{"member_id":String, "friend_name":String, "profile_pic":String}],
    friend_requests:[{"member_id":String, "friend_name":String, "profile_pic":String}],

    wins: {type:Number, default: 0},
    losses: {type:Number, default: 0},

    open_bets: [{"challenger_id":String, "challenger_name":String, "mediator_id":String, "amount_to_win":Number, "amount_to_pay":Number}],
    closed_bets: [{"challenger_id":String, "challenger_name":String, "profile_pic":String, "win":Boolean, "amount_paid":Number, bet_data: {type: Date, default: Date.now}}],
    requests: [{"challenger_id":String, "challenger_name":String, "amount_to_win":Number, "amount_to_pay":Number}],

    user_profile:[userProfileSchema],
    wallet: [walletSchema]//sub document
})

var User = mongoose.model("User", userSchema);

module.exports = User;

