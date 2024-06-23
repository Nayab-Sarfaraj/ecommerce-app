const { compareSync } = require("bcrypt");
const express = require("express");
require("dotenv").config();
require("./db/connection");
const app = express();
const ProductRouter = require("./routes/productRoutes");
const CustomErrorHandler = require("./middleware/error");
const OrderRouter = require("./routes/orderRoutes");
const UserRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const v2 = require("cloudinary")

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
app.use("/api/v1", ProductRouter);
app.use("/api/v1", UserRouter);
app.use("/api/v1", OrderRouter);
app.use(CustomErrorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on the port ${PORT}`));
