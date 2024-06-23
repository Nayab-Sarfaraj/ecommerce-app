const mongoose = require("mongoose");

const connectToDatabse = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ecom");
  } catch (error) {
    handleError(error);
  }
};
mongoose.connection.on("connected", () =>
  console.log("successfully connected to database")
);
mongoose.connection.on("open", () => console.log("opening the database"));
mongoose.connection.on("disconnected", () =>
  console.log("disconnected from database")
);
mongoose.connection.on("reconnected", () =>
  console.log("reconnectin to teh database")
);
connectToDatabse();
