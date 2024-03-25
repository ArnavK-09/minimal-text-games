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

export const startNewGame = async (
	host: string,
	game: string,
	id: string,
	status = 'waiting'
) => {
	const query = `INSERT INTO Games (status, host, id, game) VALUES (${status}, ${host}, ${id}, ${game});`;
	return await MindsDB.SQL.runQuery(query);
};

export const joinGame = async (gameID: string, newPlayerId: string, expectedText: string, meta = "none") => {
    const query = `UPDATE Game SET against = '${newPlayerId}', status = 'player_joined', expected = ${expectedText}, meta = ${meta} WHERE id = ${gameID};`
    return await MindsDB.SQL.runQuery(query);
};

export const getNewGame = async (gameID: string) => {
    const query = `SELECT * FROM Games WHERE id = ${gameID};`;
	return await MindsDB.SQL.runQuery(query);
};
