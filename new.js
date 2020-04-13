const mongoose = require("mongoose");
const mongodb = require("mongodb")
let ObjectID = require("mongoose").ObjectID;
const mongo = require('./controllers/add')
let Campground = mongoose.model("Campground");

let gh = "5e9005965931c732a3644a67";

Campground.findById(gh).populate("commment").then((doc)=>{
    console.log(doc);
}).catch((err)=>{
    console.log(err);
    
})