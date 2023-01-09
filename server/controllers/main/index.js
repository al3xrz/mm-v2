const Zabbix = require("../../lib/zabbix");

class MainController {
  constructor() {
    this.zabbix = new Zabbix(
      process.env.Z_SERVER,
      process.env.Z_NAME,
      process.env.Z_PASSWORD
    );
  }

  async updateState(){

  }

  


}
