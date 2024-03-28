// imports
import Flagsmith from 'flagsmith-nodejs';
import { env } from '$env/dynamic/private';

// init
const flagsmith = new Flagsmith({
	environmentKey: env.FLAGSMITH_ENV_KEY 
});

// export
export default flagsmith;
