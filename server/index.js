require("dotenv").config();
const { updateState } = require("./controllers/complexes");
const express = require("express");

const rolesRouter = require("./routes/roles");

const app = express();

app.use(express.json());
app.use(express.static('./public'));

app.get("/", async (req, res) => {
  // res.status(200).json(state);
  res.sendFile("/index.html");
});

app.use("/api/roles", rolesRouter);




app.listen(process.env.EXPRESS_PORT || 3000, () => {
  console.log("Server started");
  // updateState(300_000);
});

