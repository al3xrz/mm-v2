const state = require("../../../state");
const { itemsNormalizer } = require("../../../lib/utils/items");

async function complexGroup(zabbix, markerGroup, complexGroup, stateName) {
  try {
    const hosts = await zabbix.getGroupInfo(complexGroup);
    const markers = await zabbix.getGroupInfo(markerGroup);
    for (const marker of markers) {
      let index = marker.host.split("_")[1];
      let innerHosts = hosts.filter(
        (host) => host.host.split(".")[0].split("_")[1] == index
      );
      marker.name = `ФЕД. ${marker.name.split(" / ")[0]}`;
      marker.hosts = innerHosts;
      marker.problemPriority = 0;
      marker.totalCount = marker.hosts.length;
      marker.workCount = 0;
      marker.hosts.forEach((host) => {
        host.items = itemsNormalizer(host.items);
        if (host.triggers.length === 0) {
          marker.workCount++;
        } else {
          if (host.triggers[0].priority > marker.problemPriority)
            marker.problemPriority = host.triggers[0].priority;
        }
      });
    }
    state[stateName].payload = markers;
    state[stateName].error = null;
    state[stateName].errorsCounter = 0;
  } catch (e) {
    console.log(e);
    state[stateName].payload = [];
    state[
      stateName
    ].error = `Ошибка получения списка ${markerGroup} ${complexGroup}`;
    state[stateName].errorsCounter++;
    return [];
  } finally {
    state[stateName].lastUpdate = +new Date();
  }
}


module.exports = {
  complexGroup,
};
