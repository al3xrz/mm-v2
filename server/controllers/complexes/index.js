const { delay } = require("../../lib/utils/common");
const mainController = require("./main");
const fedController = require("./derbent");
const crossroadsController = require("./crossroads");

async function updateState(ms) {
    while (true) {
        await mainController.updateState();
        await fedController.updateState();
        await crossroadsController.updateState();
        await delay(ms);
    }
}

module.exports = {
    updateState,
}
