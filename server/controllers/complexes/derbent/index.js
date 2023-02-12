const Zabbix = require("../../../lib/zabbix");
const { complexGroup } = require("./helpers");

// контроллер федерального сервера видеоаналитики
class DerbentController {
  constructor() {
    this.zabbix = new Zabbix(
      process.env.Z_SERVER_F,
      process.env.Z_NAME_F,
      process.env.Z_PASSWORD_F
    );
  }

  async updateState() {
    try {
      await this.zabbix.login();
      await complexGroup(this.zabbix, "Markers", "Video", "videoDerbent");
    } catch (e) {
      console.log(e);
    } finally {
      this.zabbix.logout();
    }
  }
}

module.exports = new DerbentController();
