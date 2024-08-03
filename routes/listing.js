const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//index and Create Route
router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(ListingController.createListing));

//New Route
router.get("/new",isLoggedIn,ListingController.renderNewForm);

//Show Update and Delete Route
router.route("/:id")
.get( wrapAsync(ListingController.showlisting))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;

