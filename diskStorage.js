
const path = require('path');
const multer = require("multer");




//set storage engine 
const storage = multer.diskStorage({
    destination: './public/uploads/',
    // By default, multer removes file extensions so let's add them back
    //cb is call back here
    filename: function(req, file, cb) {
        //as callbacks first paramter is error so we assigned it with null
        //and 2nd parameter is the filename after the file is uploaded --here we adding timestamp value(Date.now())

        cb(null, file.fieldname +"_" + Date.now() +
            path.extname(file.originalname)); //it returns the original extension of files
    }
});

//initializing upload variable and also giving some restrictions

const limit={
    storage: storage,
    limits: { fileSize: 2000000 }, //2MB
    
};

const upload = multer(limit).single("file");

//file is the name of input field for image


module.exports = upload;
