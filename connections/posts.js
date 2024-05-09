const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
let uri = process.env.DATABASE;
mongoose
  .connect(uri)
  .then(() => {
    console.log("連線成功");
  })
  .catch((error) => {
    console.log("連線失敗", error);
  });
