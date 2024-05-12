const express = require("express");
const userRouter = require("./Routes/userRoutes");
const cors = require("cors");
const env = require("dotenv").config({ path: "config.env" });
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const port = 3000;

mongoose
  .connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((con) => {
    console.log("Db connection succesful");
  });



app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`);
});

