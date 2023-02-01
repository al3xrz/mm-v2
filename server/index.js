require("dotenv").config();
const express = require("express");
const mainController = require("./controllers/main")
const fedController = require("./controllers/derbent")
const crossroadsController = require("./controllers/crossroads")
const state = require("./state")

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  await mainController.updateState()
  await fedController.updateState()
  await crossroadsController.updateState()
  
  res.status(200).json(state);
});

app.listen(process.env.EXPRESS_PORT || 3000, () => {
  console.log("Server started");
});
