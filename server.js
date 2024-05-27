const express = require("express");
const userRouter = require("./Routes/userRoutes");
const postRouter = require("./Routes/postRoutes");
const notificationRouter = require("./Routes/notificationRoutes");
const savedPostRoutes = require('./Routes/savedPostRoutes');
const roomRouter = require("./Routes/roomRoutes");
const cors = require("cors");
const env = require("dotenv").config({ path: "config.env" });
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
    console.log("Db connection successful");
  });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use('/api/v1/savedposts', savedPostRoutes);
app.use("/api/v1/room", roomRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
