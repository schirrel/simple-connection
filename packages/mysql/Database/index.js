module.exports = (() => {
    const config = require('./Config');
    const mysql = require('mysql2');

    let pool;
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



    const connect = async (stream) => {
        if (stream) {
            config.options.stream = stream;
        }
        pool = mysql.createPool(config.options)
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                console.log('connected as id ' + connection.threadId);
                connection.query('SELECT 1');
                resolve(connection);
            } catch (err) {
                console.error('error connecting: ' + err.stack);
                reject(err);
            }

        })
    };

    return {
        connect: connect,
        query: query
    }
})();
