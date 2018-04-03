/**
 * Created by v-navray on 01/07/18.
 */
var env = process.env.NODE_ENV || 'development';




if(env == 'development' || env == 'test')
{
    const jsonConfig = require('./config.json');
    const envConfig = jsonConfig[env];
    Object.keys(envConfig).forEach((key)=>{
        process.env[key]=envConfig[key];
    })
}
