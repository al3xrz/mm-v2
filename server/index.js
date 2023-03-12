require("dotenv").config();
const { updateState } = require("./controllers/complexes");
const { verifyToken } = require("./middleware/auth");
const express = require("express");


const rolesRouter = require("./routes/roles.router");
const usersRouter = require("./routes/users.router");
const authRouter = require("./routes/auth.router");

const app = express();

app.use(express.json());
app.use(express.static('./public'));

app.use("/v1/auth", authRouter);

app.use("/test", verifyToken, async (req, res) => {
  res.json({message : "INFO"});
})

app.get("/", verifyToken , async (req, res) => {
  // res.status(200).json(state);
  res.sendFile("/index.html");
});


app.use("/api/roles", rolesRouter);
// app.use("/api/users", usersRouter);




app.listen(process.env.EXPRESS_PORT || 3000, () => {
  console.log("Server started");
  // updateState(300_000);
});

