const express = require("express");
const router = express.Router();
const { auth } = require("./../middlewares/auth.middleware");
const { isAuthorized} = require("./../middlewares/authorize.middleware");
const adController = require("./../controllers/ad.controller");
const { upload } = require("./../utils/multer");
const roles = require("./../utils/roles");


router.post("/", auth, isAuthorized(roles.advertiser), upload.array("files"), adController.createAd );  
router.get("/", auth, adController.getAds );
router.get("/:id", auth, adController.readAd);
router.patch("/:id", auth, adController.updateAttributes);
router.delete("/:id", auth, adController.deleteAd );

module.exports = router;
