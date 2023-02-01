const { unixTimeToString, uptimeToString } = require("./common");

function itemMutator(item) {
  let lastvalue = "";
  let units = "";
  switch (item.units) {
    case "ms":
      lastvalue = (+item.lastvalue).toFixed(2);
      units = item.units;
      break;
    case "db":
    case "%":
    case "C":
    case "V":
    case "A":
    case "км/ч":
    case "Mbps":
      lastvalue = Math.round(item.lastvalue);
      units = item.units;
      break;
    case "":
      lastvalue = item.lastvalue;
      units = item.units;
      break;

    case "uptime":
      lastvalue = uptimeToString(item.lastvalue);
      units = "";
      break;

    case "unixtime":
      lastvalue = unixTimeToString(item.lastvalue);
      break;

    default:
      lastvalue = item.lastvalue;
      units = item.units;
      break;
  }

  switch (item.key_) {
    case "gpio3_status":
    case "gpio2_status":
      lastvalue = lastvalue === "0" ? "OK" : "FAILED";
      break;
  }
  return {
    lastvalue,
    units,
  };
}

function itemsNormalizer(items) {
  const result = items
    .filter((item) => item.status == 0)
    .filter((item) => item.key_.indexOf("sla") == -1)
    .map((item) => {
      return {
        itemid: item.itemid,
        key_: item.key_,
        name: item.name,
        ...itemMutator(item),
      };
    });
  return result;
}

module.exports = {
  itemsNormalizer,
};
