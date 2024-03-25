// imports
import MindsDB from 'mindsdb-js-sdk';

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
// const query = `SELECT * FROM table_name`;
// const queryResult = await MindsDB.SQL.runQuery(query);

export const startNewGame = async (
	host: string,
	game: string,
	code: string,
	status = 'waiting'
) => {
	const query = `INSERT INTO Games (status, host, code, game) VALUES (${status}, ${host}, ${code}, ${game});`;
	return await MindsDB.SQL.runQuery(query);
};

export const joinGame = () => {};

export const getNewGame = () => {};
