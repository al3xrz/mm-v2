const Zabbix = require("../../../lib/zabbix");
const { simpleGroup } = require("./helpers");

class MainController {
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
      await simpleGroup(this.zabbix, "ЦОДД", "codd");
      await simpleGroup(this.zabbix, "ЦОДД-NEW", "coddNew");
      await simpleGroup(this.zabbix, "РАСЦО", "rasco");
      await simpleGroup(this.zabbix, "РАСЦО КПУ", "rascoKPU");
      await simpleGroup(this.zabbix, "РАСЦО Новые", "rascoNew");
      await simpleGroup(this.zabbix, "РАСЦО КПУ Новые", "rascoKPUNew");
      await simpleGroup(this.zabbix, "КСЭОН", "kseon");
      await simpleGroup(this.zabbix, "КСЭОН КПУ", "kseonKPU");
      await simpleGroup(this.zabbix, "УпрДор", "uprdor");
      await simpleGroup(this.zabbix, "УпрДор_21.10.22", "uprdorNew");
      await simpleGroup(this.zabbix, "Комплексы ФВФ", "pvf");
      await simpleGroup(this.zabbix, "Комплексы ФВФ отключенные", "pvfDisabled");
      await simpleGroup(this.zabbix, "ЦОДД", "pvfNew");
      await simpleGroup(this.zabbix, "Аналитика", "video");
      await simpleGroup(this.zabbix, "Аналитика_Отключенные", "videoDisabled");
    } catch (e) {
      console.log(e);
    } finally {
      this.zabbix.logout();
    }
  }
}

module.exports = new MainController();
