const axios = require("axios");
class Zabbix {
  constructor(uri, user, password) {
    this.uri = uri;
    this.user = user;
    this.password = password;
    this.apiKey = "";
  }

  async login() {
    console.log(`Connect to ${this.uri}`);
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "user.login",
        params: {
          user: this.user,
          password: this.password,
        },
        id: 1,
        auth: null,
      });
      console.log(result.data.result);
      this.apiKey = result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_API_KEY_ERROR");
    }
  }

  async logout() {
    try {
      await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "user.logout",
        params: [],
        id: 1,
        auth: this.apiKey,
      });
    } catch (e) {
      console.log(e.message);
      throw new Error("error in ZABBIX_LOGOUT_ERROR");
    }
  }

  async getGroupID(groupName) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "hostgroup.get",
        params: {
          filter: {
            name: [groupName],
          },
        },
        auth: this.apiKey,
        id: 1,
      });
      console.log(result.data.result[0]);
      return result.data.result[0].groupid;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_GROUP_ID_ERROR");
    }
  }

  async getHosts(groupID) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "host.get",
        params: {
          groupids: [groupID],
          output: ["hostid", "name", "host", "inventory", "status"],
          selectMacros: ["macro", "value"],
          selectInventory: [
            "location",
            "location_lat",
            "location_lon",
            "url_a",
          ],
          selectItems: [
            "key_",
            "name",
            "status",
            "value_type",
            "description",
            "lastvalue",
            "units",
          ],
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_HOSTS_ERROR");
    }
  }

  async getTriggers(groupID) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "trigger.get",
        params: {
          only_true: 1,
          monitored: 1,
          active: 1,
          skipDependent: 1,
          groupids: groupID,
          selectHosts: ["hostid"],
          output: [
            "triggerid",
            "description",
            "status",
            "lastchange",
            "priority",
            "state",
            "value",
          ],
          filter: {
            value: 1,
          },
          sortfield: "priority",
          sortorder: "DESC",
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_TRIGGERS_ERROR");
    }
  }

  async getEvents(groupID) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "event.get",
        params: {
          groupids: [groupID],
          output: "extend",
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_EVENTS_ERROR");
    }
  }

  async getProblems(groupID) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "problem.get",
        params: {
          output: "extend",
          selectAcknowledges: "extend",
          selectTags: "extend",
          groupids: [groupID],
          recent: true,
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_EVENTS_ERROR");
    }
  }

  async getHostsByID(hostIDs) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "host.get",
        params: {
          hostids: hostIDs,
          output: ["hostid", "name", "host", "inventory"],
          selectMacros: ["macro", "value"],
          selectInventory: ["location", "location_lat", "location_lon"],
          selectItems: [
            "key_",
            "name",
            "status",
            "value_type",
            "description",
            "lastvalue",
            "units",
          ],
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_HOSTS_BY_IDS_ERROR");
    }
  }

  async getHistory(itemIDs) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "history.get",
        params: {
          output: "extend",
          // hostids : hostIDs,
          itemids: itemIDs,
          limit: 10,
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_HISTORY_ITEMS_ERROR");
    }
  }

  async getItems(hostIDs, key) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "item.get",
        params: {
          output: ["itemid", "name", "hostid", "lastvalue", "prevvalue"],
          hostids: hostIDs,
          search: {
            key_: key,
          },
          sortfield: "name",
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_ITEMS_ERROR");
    }
  }

  async getSLATriggers(groupID) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "trigger.get",
        params: {
          selectTags: "extend",
          groupids: [groupID],
          selectHosts: ["hostid"],
          output: [
            "trigerrid",
            "description",
            "status",
            "lastchange",
            "priority",
            "state",
            "value",
          ],
          tags: [{ tag: "sla", value: 1, operator: 1 }],
          sortorder: "DESC",
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_SLATRIGGERS_ERROR");
    }
  }

  async getService() {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "service.get",
        params: {
          output: "extend",
          selectDependencies: "extend",
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result.find((item) => item.triggerid == triggerid);
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_SERVICE_ERROR");
    }
  }

  async getAllServices() {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "service.get",
        params: {
          output: "extend",
          selectDependencies: "extend",
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_ALLSERVICES_ERROR");
    }
  }

  async getAllSLA() {
    try {
      let services = await this.getAllServices();
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "service.get",
        method: "service.getsla",
        params: {
          intervals: [
            {
              from: Math.round(Date.now() / 1000) - 2592000, // 30 дней
              to: Math.round(Date.now() / 1000),
            },
          ],
        },
        auth: this.apiKey,
        id: 1,
      });
      const res = result.data.result;
      services = services
        .filter((item) => item.triggerid != 0)
        .map((item) => ({
          ...item,
          sla: res[item.serviceid].sla[0],
        }));
      return services;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_ALL_SLA_ERROR");
    }
  }

  async getHostInfo(hostid) {
    try {
      const host = await this.getHostsByID(hostid);
      return host;
    } catch (e) {
      console.log.log(e.message);
      throw new Error("ZABBIX_GET_HOSTINFO_ERROR");
    }
  }

  async getHost(hostid) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "host.get",
        params: {
          hostids: [hostid],
          output: ["hostid", "name", "host", "inventory", "status"],
          selectMacros: ["macro", "value"],
          selectInventory: [
            "location",
            "location_lat",
            "location_lon",
            "url_a",
          ],
          selectItems: [
            "key_",
            "name",
            "status",
            "value_type",
            "description",
            "lastvalue",
            "units",
          ],
          selectTriggers: [
            "triggerid",
            "status",
            "value",
            "description",
            "state",
          ],
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_HOST_ERROR");
    }
  }

  async getSLA(serviceid, from, to) {
    try {
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "service.getsla",
        params: {
          serviceids: [serviceid],
          intervals: [
            {
              from: from,
              to: to,
            },
          ],
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_SLA_ERROR");
    }
  }

  async getHostSLA(options) {
    console.log("in zabbix-host-sla", options);
    try {
      const host = await this.getHost(options.hostid);
      const slaTrigger = host.triggers.find((trigger) =>
        trigger.description.toUpperCase().includes("SLA")
      );
      const service = await this.getService(slaTrigger.triggerid);
      const sla = await this.getSLA(
        service.serviceid,
        options.from,
        options.to
      );
      return Object.values(sla)[0].sla[0];
    } catch (e) {
      console.log(e);
      throw new Error("ZABBIX_GET_HOST_SLA_ERROR");
    }
  }

  // main result
  async getGroupInfo(groupName) {
    try {
      const id = await this.getGroupID(groupName);
      const hosts = await this.getHosts(id);
      const sla = await this.getAllSLA(); // оптимизировать выборку
      const slaTriggers = await this.getSLATriggers(id);
      const triggers = await this.getTriggers(id);
      const problems = await this.getProblems(id);

      for (const trigger of triggers) {
        trigger.problem = problems.filter((problem) => {
          return problem.objectid === trigger.triggerid;
        })[0];
      }

      for (const host of hosts) {
        host.triggers = triggers.filter((trigger) => {
          return (
            host.hostid == trigger.hosts[0].hostid &&
            trigger.description.indexOf("SLA") === -1
          );
        });

        host.slaTrigger = slaTriggers.find((trigger) => {
          return host.hostid == trigger.hosts[0].hostid;
        });

        if (host.slaTrigger) {
          host.sla = sla.find(
            (item) => item.triggerid === host.slaTrigger.triggerid
          );
        }
      }
      return hosts;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_GROUP_INFO_ERROR");
    }
  }

  async updateMacros(hostid, macros) {
    try {
      const host = await this.getHostsByID(hostid);
      macros.forEach((element) => {
        host[0].macros.find((macro) => macro.macro == element.macro).value =
          element.value;
      });
      const result = await axios.post(this.uri, {
        jsonrpc: "2.0",
        method: "host.update",
        params: {
          hostid: hostid,
          macros: [...host[0].macros],
        },
        auth: this.apiKey,
        id: 1,
      });
      return result.data.result;
    } catch (e) {
      console.log(e.message);
      throw new Error("ZABBIX_GET_SLA_ERROR");
    }
  }
}
module.exports = Zabbix;
