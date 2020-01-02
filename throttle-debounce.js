/*
 * nodejs throttle / debounce
 *
 * Original code copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 * NodeJS fork by Lilith Song <lsong@princessrtfm.com>
 *
 * At this point, most of the code here is mine (Lilith's) because I was having enough trouble parsing Ben's execution
 * logic that I just rewrote it. I'm keeping his credit here because I based it off of his work.
 */

// Forked version:
//   github: https://github.com/PrincessRTFM/node-throttle-debounce
//   source: https://raw.githubusercontent.com/PrincessRTFM/node-throttle-debounce/master/throttle-debounce.js
//
// Original version:
//   project home - https://benalman.com/projects/jquery-throttle-debounce-plugin/
//   github       - https://github.com/cowboy/jquery-throttle-debounce/
//   source       - https://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.js
//   (minified)   - https://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.min.js

const throttle = (delay, trailing, callback, debounceMode) => {
	// If you leave out the trailing parameter, we shift things down and fill it in
	if (typeof trailing == 'function') {
		// Shift callback -> debounceMode
		debounceMode = callback;
		// Shift trailing -> callback
		callback = trailing;
		// Default to executing the trailing call
		trailing = true;
	}
	// After the wrapper has stopped being called, this timeout ensures that `callback` is executed at the proper times
	// when told to execute a trailing call.
	let timeout = void 0;
	const stopTimeout = () => { // eslint-disable-line unicorn/consistent-function-scoping
		try {
			clearTimeout(timeout);
		}
		catch (err) {
			// nop
		}
	};
	const resetTimeout = () => {
		stopTimeout();
		timeout = void 0;
	};
	// The actual throttle/debounce logic - the wrapper function only does what the specified mode needs it to.
	if (debounceMode) {
		if (trailing) {
			// debounce, trailing execution
			// - clear any existing timeout, set the timeout to execute
			return function wrapperDebounceTrailing(...args) {
				const executionContext = this;
				const exec = () => {
					Reflect.apply(callback, executionContext, args);
				};
				resetTimeout();
				timeout = setTimeout(exec, delay);
			};
		}
		// debounce, leading execution
		// - if delay expired or first call, execute
		// - update/set reset timer
		return function wrapperDebounceLeading(...args) {
			if (!timeout) { // first call, or resetTimeout() called
				Reflect.apply(callback, this, args);
			}
			// Stop the timeout, then immediately set it again, starting from now
			stopTimeout();
			timeout = setTimeout(resetTimeout, delay);
		};
	}
	// Keep track of the last time `callback` was executed.
	let lastExec = 0;
	if (trailing) {
		// throttle, trailing execution enabled
		// - if within delay, nop
		// - it not within delay, execute and set timeout
		return function wrapperThrottleTrailing(...args) {
			const executionContext = this;
			const elapsed = Number(new Date()) - lastExec;
			const exec = () => {
				lastExec = Number(new Date());
				Reflect.apply(callback, executionContext, args);
			};
			if (elapsed > delay) { // outside timeout
				exec();
			}
			else { // within timeout
				stopTimeout();
				timeout = setTimeout(exec, delay - elapsed); // schedule to execute `delay` ms after the last execution
			}
		};
	}
	// - throttle, trailing execution disabled
	return function wrapperThrottleNoTrailing(...args) {
		const executionContext = this;
		const elapsed = Number(new Date()) - lastExec;
		const exec = () => {
			lastExec = Number(new Date());
			Reflect.apply(callback, executionContext, args);
		};
		if (elapsed > delay) { // outside timeout
			exec();
		}
		// not setting a timeout to execute, because trailing execution is disabled
	};
};
// Method: debounce
//
// Debounce execution of a function. Debouncing, unlike throttling, guarantees that a function is only executed a single
// time, either at the very beginning of a series of calls, or at the very end. The delay specifies how much time (in ms)
// must pass where the function is NOT called before it will execute again. If you want to simply rate-limit execution
// of a function, see the <throttle> method.
const debounce = function debounce(...args) {
	return throttle(...args, true);
};

module.exports = {
	throttle,
	debounce,
};

