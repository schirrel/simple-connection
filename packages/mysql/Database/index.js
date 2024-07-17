module.exports = (() => {
    const config = require('./Config');
    const mysql = require('mysql');

    const connection = mysql.createConnection(config.options);

    const pool = mysql.createPool(config.options);
    const getConnection = () => {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, successfulConnection) {
                if (err) {
                    console.log(err);
                    return reject()
                }
                resolve(successfulConnection)
            })
        })
    };

    const query = (query, params = []) => {
        return new Promise(async (resolve, reject) => {
            const builder = await getConnection();
            builder.query(query, params, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results);
            });
        })
    }



    const connect = async () => {
        return new Promise((resolve) => {

            connection.connect(function (err) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }

                console.log('connected as id ' + connection.threadId);
                connection.query('SELECT 1');
                resolve(connection);
            });

        })
    };

    return {
        connect: connect,
        query: query
    }
})();
