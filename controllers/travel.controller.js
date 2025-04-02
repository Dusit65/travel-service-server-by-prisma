//File that writes control operations for a table in the database
//เช่น insert, update, delete, select
//This file works with travel_tb
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//import to use Cloudinary
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Use prisma to co working with DB
const { PrismaClient } = require("@prisma/client"); //Models
const prisma = new PrismaClient();

//config cloudinary
cloudinary.config({ 
  cloud_name: 'dtaoywhpf', 
  api_key: '646185354323959', 
  api_secret: 'G7FBhJLwqBsgkdAt_V36Dgzm1L4' // Click 'View API Keys' above to copy your API secret
});
//++++++++++++++++++++++++++++++ End of Require +++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++ INSERT UPDATE DELETE FUNC ++++++++++++++++++++++++++++++++++++
//Func Insert Travel ==================================================== dev urself (add travllerId)
exports.createTravel = async (req, res) => {
  try {
    const result = await prisma.travel_tb.create({
          data: {
            travelPlace: req.body.travelPlace,
            travelStartDate: req.body.travelStartDate,
            travelEndDate: req.body.travelEndDate,
            travelCostTotal: parseFloat(req.body.travelCostTotal),
            travellerId: parseInt(req.body.travellerId),
            travelImage: req.file
              ? req.file.path.replace("images\\travel\\", "")
              : "",
          },
        });
    res.status(201).json({
      message: "Travel created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Func Get All Travel of one Traveller ===================================================== 
exports.getAllTravel = async (req, res) => {
  try {
    //--
    const result = await prisma.travel_tb.findMany({
      where: {
        travellerId: parseInt(req.params.travellerId)
      },
    });
    //Response
    if (result) {
      res.status(200).json({
        message: "Travel get successfully",
        data: result,
      });
    } else {
      res.status(404).json({
        message: "Travel get failed",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//Func Get Travel (Selected One)++++++++++++++++++++++++++++++++++++++++++ dev urself (use travelId)
exports.getTravel = async (req, res) => {
  try {
    const result = await prisma.travel_tb.findFirst({
      where: {
        travelId: parseInt(req.params.travelId)
      },
    });


    //Response
    if (result) {
      res.status(200).json({
        message: "Get this travel successfully",
        data: result,
      });
    } else {
      res.status(404).json({
        message: "Get this travel failed",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

//Func Update Travel ==================================================== dev urself (use travelId)
exports.editTravel = async (req, res) => {
  try {
    if (req.file) {
          const travel = await prisma.travel_tb.findFirst({
            where: {
              travelId: Number(req.params.travelId),
            },
          });
          //ถ้ามีไฟล์เก่าให้ลบออก
          if (travel.travelImage) {
            fs.unlinkSync("images/travel/" + travel.travelImage, (err) => {
              console.log(err);
            });
          }
    
          result = await prisma.travel_tb.update({
            where: {
              travelId: Number(req.params.travelId),
            },
            data: {
              travellerId: Number(req.body.travellerId),
              travelPlace: req.body.travelPlace,
              travelStartDate: req.body.travelStartDate,
              travelEndDate: req.body.travelEndDate,
              travelCostTotal: parseFloat(req.body.travelCostTotal),
              travelImage: req.file.path.replace("images\\travel\\", ""),
            },
          });
        } else {
          //กรณีไม่มีการอัพโหลดรูป
          result = await prisma.travel_tb.update({
            where: {
              travelId: Number(req.params.travelId),
            },
            data: {
              travellerId: Number(req.body.travellerId),
              travelPlace: req.body.travelPlace,
              travelStartDate: req.body.travelStartDate,
              travelEndDate: req.body.travelEndDate,
              travelCostTotal: parseFloat(req.body.travelCostTotal)
            },
          });
        }
        
       
    //Response
    res.status(200).json({
      message: "Travel updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Func Delete Travel ====================================================
exports.deleteTravel = async (req, res) => {
  try {
    //--
    const result = await prisma.travel_tb.delete({
      where: {
        travelId: parseInt(req.params.travelId)
      },
    });
    //ค้นหาเพื่อเอารูปมาลบ
      
      
    res.status(200).json({
      message: "Travel Deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//++++++++++++++++++++ Travel Image upload function +++++++++++++++++++++++++++++++++
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "images/travel");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       "travel_" +
//         Math.floor(Math.random() * Date.now()) +
//         path.extname(file.originalname)
//     );
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const newFile = 'travel_' + Math.floor(Math.random() * Date.now());

    return {
      folder: "images/travel",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: newFile,
    };
  }
});

exports.uploadTravel = multer({
  storage: storage,
  limits: {
    fileSize: 100000000,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Images Only!");
  },
}).single("travelImage");


