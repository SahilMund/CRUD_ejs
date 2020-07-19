const express = require("express");
const empModel = require("../model/emp");
const router = express.Router();
const upload  = require('../diskStorage')

const employee = empModel.find({});

/* GET home page. */
// router.get('/', (req, res)=> {
//     employee.exec((err,data)=>{
//         if(err) throw err;
//         res.render('index', { title: 'Employee Records',records:data })
//     });
// });

//-----------------Uploading Image using multer-------------------------
// router.post('/upload', upload,function(req, res, next) {
//   var imageFile=req.file.filename;
//  var success =req.file.filename+ " uploaded successfully";

//  var imageDetails= new uploadModel({
//   imagename:imageFile
//  });
//  imageDetails.save(function(err,doc){
// if(err) throw err;

// imageData.exec(function(err,data){
// if(err) throw err;
// res.render('upload-file', { title: 'Upload File', records:data,   success:success });
// });

//  });

//   });

//------------------getting contacts in tabular format--------------------
router.get("/", (req, res) => {
  empModel
    .find({})
    .then((data) => {
      // console.log(data)
      res.render("index", {
        title: "Employee Records",
        records: data,
        success: "",
        theme:"alert-success",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//----------------creating  new Contact----------------------------------
router.post("/",upload, (req, res) => {
  const { name, email, etype, hourlyrate, totalHour } = req.body;
  //req.body.<name of input tag>
  if(req.file){
    var data={
      name,
    email,
    etype,
    hourlyrate,
    totalHour,
    total: parseInt(hourlyrate) * parseInt(totalHour),
    image:req.file.filename,
    }
  }

  else{
    var data={
      name,
    email,
    etype,
    hourlyrate,
    totalHour,
    total: parseInt(hourlyrate) * parseInt(totalHour),
    }

  }
  var empDetails = new empModel(data);
  //console.log(empDetails);
  empDetails.save((err, doc) => {
    if (err) throw err;
    employee.exec((err, data) => {
      if (err) throw err;
      res.render("index", {
        title: "Employee Records",
        records: data,
        success: "New Record Inserted Succefully",
        theme:"alert-success",
      });
    });
  });
});

//-------------------------------for filtering the data--------------
router.post("/search", (req, res) => {
  const { fltrname, fltemail, fltremptype } = req.body;

  if (fltrname && fltemail && fltremptype) {
    var filterData = {
      $and: [
        { name: fltrname },
        { $and: [{ email: fltemail }, { etype: fltremptype }] },
      ],
    };
  } else if (fltrname && !fltemail && fltremptype) {
    var filterData = {
      $and: [
        { name: fltrname },
        { $or: [{ email: fltemail }, { etype: fltremptype }] },
      ],
    };
  } else if (!fltrname && fltemail && fltremptype) {
    var filterData ={
      $and: [
        { email: fltemail },
        { $or: [{ name: fltrname }, { etype: fltremptype }] },
      ],
    };
    //  { $and: [{ email: fltemail }, { etype: fltremptype }] };
  } else if (!fltrname && !fltemail && fltremptype) {
    var filterData = { etype: fltremptype };
  } else if (fltrname && !fltemail && !fltremptype) {
    var filterData = { name: fltrname };
  } else {
    var filterData = {};
  }

  console.log(` Searching .........`);
   console.log(filterData);
  const employeeFilter = empModel.find(filterData);

  employeeFilter.exec((err, data) => {
    if (err) throw err;
    res.render("index", { title: "Employee Records", records: data ,success:''});
  });
});

//-----------------------AutoComplete Search Name SUggestion using Jquery ui-------------------
router.get('/autocomplete/',(req,res)=>{

  var rgx=new RegExp(req.query["term"],'i');
  //for autocomplete suggestion  comapring the monodb name data into name query by 
  const employeeSugg = empModel.find({name:rgx},{'name':1}).sort({'updated_at':-1}).sort({'created_at':-1}).limit(20);

  
  employeeSugg.exec((err, data) => {
    var result=[];
    console.log(data)
    if(!err) {
    if(data && data.length && data.length>0){
      data.forEach((users)=>{
        let obj = {
          id:users._id,
          label:users.name
        };
        result.push(obj)
      })
    }
    res.jsonp(result);
  }

  
});

});

//--------------------deleting the records by id-------------------------------------
router.get("/delete/:id", (req, res) => {

  const Id = req.params.id;
    // console.log(Id);
    var del = empModel.findByIdAndDelete(Id);
    del.exec((err, data) => {
      if (err) throw err;
      employee.exec(function (err, data) {
        if (err) throw err;
        res.render('index', { title: 'Employee Records',records:data ,
     success:"Records Deleted Successfully",theme:"alert-danger",})
     // res.redirect("/");
      });
    });
});


//------------------updating the records by id-----------------------

router.get("/edit/:id", (req, res) => {
  empModel
    .findById(req.params.id)
    .then((data) => {
      console.log(data);
      res.render("update", { title: "Edit Employee Records", records: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/updating",upload, (req, res) => {

  if(req.file){
    var dataSet = {
      name: req.body.uname,
      email: req.body.email,
      etype: req.body.emptype,
      hourlyrate: req.body.hrlyrate,
      totalHour: req.body.ttlhr,
      total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
      image:req.file.filename
    };
  }
  else{
    var dataSet = {
      name: req.body.uname,
      email: req.body.email,
      etype: req.body.emptype,
      hourlyrate: req.body.hrlyrate,
      totalHour: req.body.ttlhr,
      total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
    };
  }
  console.log(`updated ${req.body.uname} Successfully`);

  const Id = req.body.id;
  // console.log(Id);
  var update = empModel.findByIdAndUpdate(Id, dataSet);
  update.exec((err, data) => {
    if (err) throw err;
    employee.exec(function (err, data) {
      if (err) throw err;
      res.render("index", { title: "Edit Employee Records", records: data,
                  success:"Records Updated Successfully",theme:"alert-success", });
      // res.redirect("/");
    });
  });
});



//-----------------------rendering to 404 page not found page-------------------
router.get('*',(req,res)=>{
  // res.status(404).send('page Not Found')
  res.render("pageNotFound", { title:"Page Not Found"})
});

module.exports = router;
