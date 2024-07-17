
const config = require('../../Database/Config');

class QueryBuilder {
	static insert(tableName, params) {
		let values = ' VALUES (';
		
		let myQuery = `insert into ${config.schema}.${tableName}  (`;
		let keys = Object.keys(params);

		for (let i = 0; i < keys.length; i++) {
			myQuery += '' + keys[i] + (i < keys.length - 1 ? ',' : ')');
			values += ' ? ' + (i < keys.length - 1 ? ',' : ')');
		}
		let arrayValues = Object.keys(params).map(function (key) {
			return params[key];
		});
		myQuery = myQuery.concat(values);
		// myQuery = myQuery.concat(' RETURNING *');

		return {
			query: myQuery,
			values: arrayValues
		};
	}
	static update(tableName, params, primaryKey) {
		let myQuery = `UPDATE ${config.schema}.${tableName}  SET `;
		let keys = Object.keys(params).filter(k => k != primaryKey);
		let vals = [];
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] != primaryKey) {
				myQuery += '' + (keys[i] + " = " + ' ? ' + (i < keys.length - 1 ? ',' : ''));
				vals.push(params[keys[i]])
			}
		}

		myQuery +=` where ${primaryKey} = ? `;
		
		// myQuery = myQuery.concat(' RETURNING *');
		vals.push(params[primaryKey])

		return {
			query: myQuery,
			values: vals
		};
	}
	static search(table, properties, options={useLike:{}}) {
		const {useLike} = options;
		let keys = Object.keys(properties);
		let myQuery = `SELECT *  FROM ${config.schema}.${table.tableName} ${keys.length ? 'where' :''} `;
		let vals = [];


		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			myQuery += '' + (table.getColumn(key)) + ( useLike && useLike[key] ? " LIKE " : " = ") + ' ?'  + (i < keys.length - 1 ? ' and ' : '');
			vals.push(properties[key]);
		}

		if(options.custom) {
			myQuery += '' + options.custom.query;
			vals.push(...(options.custom.values || []));
		}

		return {
			query: myQuery,
			values: vals
		};


	}
	static delete(table, id) {

		return { query: `DELETE FROM ${config.schema}.${table.tableName} where ${table.primaryKey}  =  ?`, vals: [id || table.primaryKeyValue] };
	}
	static get(table) {

		return { query: `SELECT * FROM ${config.schema}.${table.tableName} where ${table.primaryKey}  =  ?`, vals: [table.primaryKeyValue] };
	}
	static list(tableName) {

		return { query: `SELECT * FROM ${config.schema}.${tableName}`, vals: [] };
	}

}
module.exports = QueryBuilder;
