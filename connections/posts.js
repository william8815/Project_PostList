const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
let uri = process.env.DATABASE;
uri = uri.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose
  .connect(uri)
  .then(() => {
    console.log("連線成功");
  })
  .catch((error) => {
    console.log("連線失敗", error);
  });
