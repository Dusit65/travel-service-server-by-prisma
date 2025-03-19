//This file is used to manage routing for service / API calls
//This file works with travel_tb

//call express to use router module
const express = require("express");
const travelCtrl = require("./../controllers/travel.controller.js");
const router = express.Router();

//Routing is based on RESTful API principles
//GET = ค้นหา ตรวจสอบ ดึง ดู, POST = เพิ่ม, PUT = แก้ไข, DELETE = ลบ

router.post("/", travelCtrl.uploadTravel, travelCtrl.createTravel);
router.get("/:travellerId", travelCtrl.getAllTravel);
router.get("/one/:travelId", travelCtrl.getTravel); //get selected travel
router.put("/:travelId", travelCtrl.uploadTravel, travelCtrl.editTravel);
router.delete("/:travelId", travelCtrl.deleteTravel);

//export router for call to use
module.exports = router;