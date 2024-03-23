// imports
import Flagsmith from 'flagsmith-nodejs';

// init
const flagsmith = new Flagsmith({
	environmentKey: 'ser.'
});

// export
export default flagsmith;
