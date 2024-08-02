const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js")

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
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync( async (req,res,next)=>{
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing) ;
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;

