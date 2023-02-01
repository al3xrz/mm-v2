const state = require("../../state");
const { itemsNormalizer } = require("../../lib/utils/items");

async function simpleGroup(zabbix, groupName, stateName) {
  try {
    const payload = (await zabbix.getGroupInfo(groupName)).map((host) => {
      return {
        // ...host,
        hostid: host.hostid,
        name: host.name,
        host: host.host,
        status: host.status,
        inventory: host.inventory,
        macros: host.macros,
        items: itemsNormalizer(host.items),
        severity:
          Math.max(
            ...host.triggers.map((trigger) => trigger.problem.severity)
          ) || 0,
        problems: host.triggers.map((trigger) => {
          return {
            triggerid: trigger.triggerid,
            eventid: trigger.problem.eventid,
            problemName:
              trigger.problem.tags.find((tag) => tag.tag === "name")?.value ||
              trigger.description,
            problemDuration:
              Math.floor(Date.now() / 1000) -
                parseInt(trigger.lastchange) +
                parseInt(
                  trigger.problem.tags.find((tag) => tag.tag === "base")?.value
                ) || parseInt(trigger.lastchange),
            acknowledged: trigger.problem.acknowledged,
            severity: trigger.problem.severity,
          };
        }),
      };
    });

    state[stateName].payload = payload;
    state[stateName].error = null;
  } catch (e) {
    console.log(e);
    state[stateName].payload = [];
    state[stateName].error = `Ошибка получения списка ${groupName}`;
  } finally {
    state[stateName].lastUpdate = +new Date();
  }
}

module.exports = {
  simpleGroup,
};
