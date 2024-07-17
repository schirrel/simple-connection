
module.exports = (() => {
    const dotenv = require('dotenv');
    dotenv.config();
    const config = {
        options: {
            connectionLimit : process.env.CON_LIMIT || 10,
            user: process.env.CON_USER,
            host: process.env.CON_URL,
            database: process.env.CON_DATABASE,
            password: process.env.CON_PASSWORD,
            port: process.env.CON_PORT || 3306,
            ssl: false
        },
        schema: process.env.CON_SCHEMA,
        log: process.env.CON_LOG == 'true'
    };
    if (process.env.CON_SSL == 'true') {
        config.options.ssl = true;
    }
    if (process.env.CON_REJECT_UNHAUTHORIZED == "false") {
        config.options.ssl = { rejectUnauthorized: false };
    }

    return config;
})();
