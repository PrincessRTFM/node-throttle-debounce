#!/usr/bin/env node

const {
	throttle,
	debounce,
} = require('.');

let counterThrottle = 0;
let counterDebounce = 0;

const callbackThrottle = (counter, delay) => {
	console.log(`Throttled execution #${counter} after ${delay}ms!`);
};
const callbackDebounce = (counter, delay) => {
	console.log(`Debounced execution #${counter} after ${delay}ms!`);
};

const throttled = throttle(250, callbackThrottle);
const debounced = debounce(250, callbackDebounce);

console.log([
	"Ten calls to the throttle/debounce wrappers will be made, each queued 100ms after the last.",
	"The wrappers are all set to a delay of 250ms, which means that the first call should execute @ 100ms, the second",
	"one @ 200ms (+100) should be delayed for another 150ms, the third @ 300ms (+200) should REPLACE the second and be",
	"delayed for another 50ms (at which point it will run, saying 300ms but actually happening at 350ms), the fourth",
	"one @ 400ms (+50) should delay, the fifth @ 500ms (+150) should delay, the sixth @ 600ms (+250) should run",
	"(cancelling the fifth, which cancelled the fourth), 700ms (+100) delays, 800ms (+200) delays and replaces seven,",
	"800ms runs 50ms later (reporting #8), 900ms (+50) delays, 1000ms (+150) delays and replaces nine, nothing else",
	"is queued so ten runs 100ms late and reports 1000ms because it was queued. At this point, the debounced one ALSO",
	"runs, claiming invocation #10 because all of the earlier ones were replaced in the queue.",
	"",
	"After that, another series of five (each) are queued, starting at 2500ms (well past the previous timeout) and",
	"increasing by 500ms per call, which is outside of the delay. Every single one of them should output ONCE, saying",
	"it's #11 through #15, with the delay going up in increments of 500ms starting from 2500.",
	"",
	"If that happens, it's working. If it doesn't, something's broken.",
	"",
	"",
	"",
].join("\n"));

for (let mult = 1; mult <= 10; mult++) {
	const delay = mult * 100;
	setTimeout(throttled.bind(throttled, ++counterThrottle, delay), delay);
	setTimeout(debounced.bind(debounced, ++counterDebounce, delay), delay);
}
for (let mult = 1; mult <= 5; mult++) {
	const delay = mult * 500 + 2000;
	setTimeout(throttled.bind(throttled, ++counterThrottle, delay), delay);
	setTimeout(debounced.bind(debounced, ++counterDebounce, delay), delay);
}

