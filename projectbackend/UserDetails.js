const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
    name:String,
    email:{type:String , unique:true},
    mobile:String,
    password:String,
    userType:String,
    address: String,
    profilePicture: { type: String, default: 'https://via.placeholder.com/150' },
},{
    collection:"UserInfo",
})
mongoose.model("UserInfo",UserDetailsSchema);