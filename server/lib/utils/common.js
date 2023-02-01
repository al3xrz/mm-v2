function uptimeToString(uptime) {
    let totalSeconds = uptime;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor((totalSeconds - days * 86400) / 3600);
    let minutes = Math.floor((totalSeconds - hours * 3600 - days * 86400) / 60);
    let seconds = Math.floor(totalSeconds - hours * 3600 - days * 86400 - minutes * 60);
    if (days === 0) {
        if (hours === 0) {
            if (minutes === 0) {
                return `${seconds}с`
            } else {
                return `${minutes}м ${seconds}с`
            }

        } else {
            return `${hours}ч ${minutes}м`
        }
    } else {
        return `${days}д ${hours}ч`
    }
}

function unixTimeToString(unixtime) {
    let milliseconds = unixtime * 1000;
    let dateObject = new Date(milliseconds);
    return dateObject.toLocaleString();
}

module.exports = {
    uptimeToString,
    unixTimeToString
}
