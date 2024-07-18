module.exports = (() => {
    const config = require('./Config');
    const mysql = require('mysql2');

    let pool;
    let connection;
    const getConnection = () => {
        return new Promise((resolve, reject) => {
            if (connection) {
                return resolve(connection);
            }
            pool.getConnection(function (err, successfulConnection) {
                if (err) {
                    console.log(err);
                    return reject()
                }
                connection = successfulConnection;
                resolve(successfulConnection)
            })
        })
    };

    const query = (query, params = []) => {

        return new Promise(async (resolve, reject) => {
            if (!pool) {
                return reject(new Error('Pool not initialized, please call Database.connect() first'));
            }
            try {
                const builder = await getConnection();
                builder.query(query, params, function (error, results, fields) {
                    if (error) reject(error);
                    else resolve(results);
                });

            } catch (err) {
                reject(err);
            }
        })
    }



    const connect = async (stream) => {
        if (stream) {
            config.options.stream = stream;
        }
        pool = mysql.createPool(config.options)
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                console.log('simple-connection :: Connection established with MySQL. Connection id ' + connection.threadId);
                connection.query('SELECT 1');
                resolve(connection);
            } catch (err) {
                console.error('simple-connection :: Error connecting: ' + err.stack);
                reject(err);
            }

        })
    };

    return {
        connect: connect,
        query: query
    }
})();
