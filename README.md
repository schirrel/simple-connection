# simple-connection
Simple PostgreSQL and MySQL query builder/ORM-ish lib for using databases with nodejs

## Install
``npm install @schirrel/simple-connection --save``

## Config
Uses `.env`  to acquire credentials.

### postgres
|Prop|Required| Default | Description |
| ------------ | ------------ | ------------ | ------------ |
|PG_USER| Required | | |
|PG_URL| Required |  | |
|PG_DATABASE |Required  | | |
|PG_PASSWORD |Required  | | |
|PG_PORT | Optional |5432 | |
|PG_SSL | Optional |false | |
|PG_REJECT_UNHAUTHORIZED | Optional | | |
|PG_LOG | Optional |false | |


### mysql
|Prop|Required| Default | Description |
| ------------ | ------------ | ------------ | ------------ |
|CON_USER| Required | | |
|CON_URL| Required |  | |
|CON_DATABASE |Required  | | |
|CON_PASSWORD |Required  | | |
|CON_PORT | Optional |3306 | |
|CON_SSL | Optional |false | |
|CON_REJECT_UNHAUTHORIZED | Optional | | |
|CON_LOG | Optional |false | |
| CON_LIMIT| Optional |10 | |


## Example

Using in 3 Steps

1. .env
```
PG_USER=postgres
PG_URL=localhost
PG_DATABASE=postgres
PG_PASSWORD=postgres
PG_SCHEMA=mercado_alencar
PG_LOG=true
```

2. Model
```javascript
const Model = require('@schirrel/simple-connection/postgres/Model');
class User extends Model{
	constructor(args = {}){
	super("USER", {
		'primaryKey' : 'ID'
	});
	this.addColumn('email', 'EMAIL');
	this.addColumn('name', 'NAME');
	this.addColumn('password', 'PASSWORD');
	this.addColumn('active', 'ACTIVE', true);
	this.setValues(args);
	}
}

module.exports = User;
```

3. Repository
```javascript
const Repository = require('@schirrel/simple-connection/postgres/Repository');
const User = require('../models/User');

class UserRepository extends Repository{
	constructor(){
		super(User);
	}
}

module.exports = UserRepository;
```

4. Your main file
```javascript


const Database = require("@schirrel/simple-connection/mysql/Database");
await Database.connect();
const userRepository = new UserRepository();

const user = await userRepository.get(123);

const newUser = new User({
	email: 'abc@email.com',
	name: 'someone',
	password: '1234123'
});

await userRepository.create(newUser);

```

And thats it.


## TL;DR
### Model
- Used as `extends Model` at your model class
- Call `super("TABLE_NAME")` with your table name 
- To add a columns `this.addColumn('email', 'EMAIL');`, it accepts a 3rd parameter as the default value.
- To set values of your constructor use ``this.setValues(args);`` 


### Repository
- Used as `extends Repository` at your repo class
- Call `super(YourClass);` with your class reference
- it already have built in: get(id), create(model), update(model),delete(id), list(), search(options)
