// imports 
import MindsDB from 'mindsdb-js-sdk';

// connect database 
export default async () => {
    console.log(MindsDB.Databases.getAllDatabases())
    try {
        await MindsDB.connect({
            user: 'mindsdbuser@gmail.com',
            password: 'mypassword'
        });
    } catch (error) {
        console.log(error)
    }
}