const defaultConfig =
{
    databaseURL: "se3350-tamatchi.firebaseapp.com",
    port: 3000,
    defaultAdminID: "IBrv424a2eY3usGCogXZUgSskgK2",
    apikey: "./apikey.json"
}

var configPath = "./config.txt";

fs = require('fs');

function init() //call on app startup to verify config
{
    if (!fs.existsSync(configPath))
    {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig), err => {console.log(err)});
        return;
    }
    else
    {
        try
        {
            var config = JSON.parse(fs.readFileSync(configPath, function(err) {if (err) throw err;}));

            for (prop in defaultConfig)//make sure all the default config options are there
            {
                if(config[prop] == null)
                {
                    throw new error("Config missing crucial data.");
                }
            }
        }
        catch(e)
        {
            console.log(e);
            console.log("Generating new config..");
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig), err => {console.log(err)});
        }
    }
}

function getConfig(name)
{
    var config = JSON.parse(fs.readFileSync(configPath, function(err) {if (err) throw err;}));
    if (name == "apikey")
    {
        if (!fs.existsSync(config[name]))
        {
            throw new Error("Set up an API key first! It is unsafe to publish API keys on github, so generate your own and store it in backend.");
        }
    }
    return config[name];
}

module.exports = {init, getConfig};