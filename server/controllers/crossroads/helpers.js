const state = require("../../state");
const { itemsNormalizer } = require("../../lib/utils/items");

async function complexGroup(zabbix, markerGroup, complexGroup, stateName) {
  try {
    const hosts = (await zabbix.getGroupInfo("Устройства перекрестков")).map(
      (host) => {
        return {
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
                    trigger.problem.tags.find((tag) => tag.tag === "base")
                      ?.value
                  ) || parseInt(trigger.lastchange),
              acknowledged: trigger.problem.acknowledged,
              severity: trigger.problem.severity,
            };
          }),
        };
      }
    );

    const markers = (await zabbix.getGroupInfo("Перекрестки")).map((marker) => {
      const crNum = marker.macros.find(
        (macro) => macro.macro === "{$CR_NUM}"
      ).value;
      const innerHosts = hosts.filter(
        (host) =>
          host.macros.find((macro) => macro.macro === "{$CR_NUM}").value ===
          crNum
      );
      return {
        ...marker,
        items: itemsNormalizer(marker.items),
        hosts: innerHosts,
        maxSeverity: Math.max(...innerHosts.map((host) => host.severity)),
      };
    });

    state[stateName].payload = markers;
    state[stateName].error = null;
  } catch (e) {
    console.log(e);
    state[stateName].payload = [];
    state[
      stateName
    ].error = `Ошибка получения списка ${markerGroup} ${complexGroup}`;
    return [];
  } finally {
    state[stateName].lastUpdate = +new Date();
  }
}

module.exports = {
  complexGroup,
};
