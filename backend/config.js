const defaultConfig =
{
    databaseURL: "se3350-tamatchi.firebaseapp.com",
    port: 3000,
    defaultAdminID: "IBrv424a2eY3usGCogXZUgSskgK2"
}

configPath = "./";

fs = require('fs');

function init() //call on app startup to verify config
{
    if (!fs.existsSync(this.configPath))
    {
        fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig), err => {console.log(err)});
        return;
    }
    else
    {
        try
        {
            var config = JSON.parse(fs.readFileSync(this.configPath, function(err) {if (err) throw err;}));

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
            fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig), err => {console.log(err)});
        }
    }
}