const Database = require("../mysql/Database");



Database.connect();
Database.query('select 1');