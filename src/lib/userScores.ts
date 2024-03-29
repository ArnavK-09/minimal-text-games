const KEY = 'user__score';

export const randomNumber = (max = 1000, min = 100) => {
	return Math.floor(Math.random() * (max - min) + min);
};

export function getUserScore() {
	let score: number = 100;
	if (!window) return score;

	if (!window?.localStorage?.getItem(KEY)) {
		window?.localStorage?.setItem(KEY, score.toString());
	} else {
		score = parseInt(window?.localStorage?.getItem(KEY) ?? '100');
	}

	return score;
}

export function updateUserScore(addition: number = randomNumber()) {
	const score: number = getUserScore();
	if (!window) return score;

	try {
		window?.localStorage?.setItem(KEY, (score + addition).toString());
	} catch (e: any) {
		console.warn(e);
	}

	return score;
}
