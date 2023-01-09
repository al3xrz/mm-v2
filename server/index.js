require("dotenv").config();
const Zabbix = require("./lib/zabbix");
// const express = require("express");

(async function () {
    console.log('in IIFE')
  const z = new Zabbix(
    process.env.Z_SERVER,
    process.env.Z_NAME,
    process.env.Z_PASSWORD
  );
  await z.login();
  const result = await z.getGroupInfo("ЦОДД");
  console.log(result);  
  await z.logout();
})();



// const app = express();
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({ res: "OK" });
// });

// app.listen(process.env.EXPRESS_PORT || 3000, () => {
//   console.log("Server started");
// });
