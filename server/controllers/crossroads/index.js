const Zabbix = require("../../lib/zabbix");
const { complexGroup } = require("./helpers");

class CrossroadsController {
  constructor() {
    this.zabbix = new Zabbix(
      process.env.Z_SERVER,
      process.env.Z_NAME,
      process.env.Z_PASSWORD
    );
  }

  async updateState() {
    try {
      await this.zabbix.login();
      await complexGroup(
        this.zabbix,
        "Перекрестки",
        "Устройства перекрестков",
        "crossroads"
      );
    } catch (e) {
      console.log(e);
    } finally {
      this.zabbix.logout();
    }
  }
}

module.exports = new CrossroadsController();
