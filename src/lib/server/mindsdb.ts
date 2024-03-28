// imports
import MindsDB from 'mindsdb-js-sdk';

const initDB = () => {
	return `
CREATE DATABASE pg_db 
WITH ENGINE = 'postgres', 
PARAMETERS = {
	"host": "ep-rapid-moon-a400s51a.us-east-1.aws.neon.tech",
	"port": 5432,
	"database": "postgres",
	"user": "default",
	"schema": "data",
	"password": "jNz8YrMF4gZI"
};`;
};

// // connect database
// export default async () => {
//     console.log(MindsDB.Databases.getAllDatabases())
//     try {
//         await MindsDB.connect({
//             user: 'mindsdbuser@gmail.com',
//             password: 'mypassword'
//         });
//     } catch (error) {
//         console.log(error)
//     }
// }

export const startNewGame = async (host: string, game: string, id: string, status = 'waiting') => {
	const query = `INSERT INTO Games (status, host, id, game) VALUES (${status}, ${host}, ${id}, ${game});`;
	// return await MindsDB.SQL.runQuery(query);
	return {
		type: 'todo',
		error_message: 'todo'
	};
};

export const joinGame = async (
	gameID: string,
	newPlayerId: string,
	expectedText: string,
	meta = 'none'
) => {
	const query = `UPDATE Game SET against = '${newPlayerId}', status = 'player_joined', expected = ${expectedText}, meta = ${meta} WHERE id = ${gameID};`;
	// return await MindsDB.SQL.runQuery(query);
	return {
		type: 'todo',
		error_message: 'todo'
	};
};

export const getNewGame = async (gameID: string) => {
	const query = `SELECT * FROM Games WHERE id = ${gameID};`;
	return await MindsDB.SQL.runQuery(query);
};
