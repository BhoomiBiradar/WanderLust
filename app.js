const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("hi , i am root")
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "my new villa",
//         description : "by the beach",
//         price : 1200,
//         location : "Calangute , Goa",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("result was saved");
//     res.send("successful testing");
// });

//Index Route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//Show Route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

app.listen(8080,()=>{
console.log("server is listening on port 8080");
});
