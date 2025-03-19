//This file is used to manage routing for service/API calls
//This file works with traveller_tb

//call express to use router module
const express = require("express");
const travellerCtrl = require("./../controllers/traveller.controller.js");
const router = express.Router();

//Routing is based on RESTful API principles
//GET = ค้นหา ตรวจสอบ ดึง ดู, POST = เพิ่ม, PUT = แก้ไข, DELETE = ลบ

router.post("/",travellerCtrl.uploadTraveller,  travellerCtrl.createTraveller);
router.get("/:travellerEmail/:travellerPassword", travellerCtrl.checkLoginTraveller);
router.put("/:travellerId", travellerCtrl.uploadTraveller,travellerCtrl.editTraveller);
// router.delete("/:travellerId", travellerCtrl.deleteTraveller);

//export router for call to use
module.exports = router;