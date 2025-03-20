const fs = require("fs");
const opn = require('opn');

const configPath = "./config.json";

let config = {
    "port": 9197,
    "clientId": "94jkvobjsghxm92mlpwyt6xmkxy7rx",
    "accessToken": null
};

const saveToken = (token) => {
    config.accessToken = token;
    fs.writeFileSync(configPath, JSON.stringify(config), {encoding: "utf-8"});
}

if (!fs.existsSync(configPath)) {
    saveToken(null);
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${config.clientId}&force_verify=true&response_type=token&redirect_uri=http://localhost:9197/auth/&scope=`;
    opn(url);
} else {
    const string = fs.readFileSync(configPath, {encoding: "utf-8"});
    config = JSON.parse(string);
}

module.exports = {config, saveToken}
