const express = require("express");
const mongoose = require("mongoose");
const { mongoURL } = require("./config/key");
const bodyParser = require("body-parser");

const app = express();

//app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// setting Public folder as static
app.use(express.static('./public'));

mongoose
  .connect(mongoURL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Mondodb Connected...."))
  .catch((err) => console.error(err));

// console.log(mongoose.connection.host)
// console.log(mongoose.connection.port)

//use mode //model register

require("./model/emp");

// Use routes // route register

app.use("/", require("./routes/crudRoute"));

//EJS
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Server working");
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
