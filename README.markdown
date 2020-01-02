
# nodejs throttle / debounce: sometimes, less is more!

Original code from [http://benalman.com/projects/jquery-throttle-debounce-plugin/](http://benalman.com/projects/jquery-throttle-debounce-plugin/), written by Ben Alman. Forked and rewritten for NodeJS by Lilith Song \<lsong@princessrtfm.com\>.

NodeJS throttle / debounce allows you to rate-limit your functions in multiple useful ways. Passing a delay and callback to `throttle` returns a new function that will execute no more than once every `delay` milliseconds. Passing a delay and callback to `debounce` returns a new function that will execute only once, coalescing multiple sequential calls into a single execution at either the very beginning or end, until `delay` milliseconds have passed, at which point it resets and may be executed again.

# Documentation

## Importing

```js
const { throttle, debounce } = require('throttle-debounce');
// or
import { throttle, debounce } from 'throttle-debounce'; // or even `import *` if you want
```

Once you have the `throttle` and `debounce` functions, their use is **almost but not quite** identical to the original version.

## Using `throttle`

```js
const throttledCallback = throttle(delayInMilliseconds[, executeTrailingCall], callbackFunction);
// Register as an event handler, call it yourself, put it in a timeout, whatever you want.
```

The difference between "trailing" (the default) and "non-trailing" (pass `false` to `executeTrailingCall`) can be visualised as follows, where `|` is a throttled-function call and `X` is the actual callback execution:

```
Throttled with `executeTrailingCall` specified as a truthy value or omitted:
||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
X    X    X    X    X    X        X    X    X    X    X    X

Throttled with `executeTrailingCall` specified as a falsey value:
||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
X    X    X    X    X             X    X    X    X    X
```

### Distinctions

The value of `executeTrailingCall` is examined, and if it is a function, it is assumed that `executeTrailingCall` was omitted and should default to `true`. If it is _not_ a function, it will be used as a boolean test, such that any truthy value will enable the trailing call and any falsey one (including `undefined`) will disable it.

### Differences from the original

The original code used an _inverted_ flag, where passing `true` would _disable_ the trailing call. This version uses `true` in that parameter to _enable_ the trailing call, which is also the default. Furthermore, type checking has been loosened.

## Using `debounce`

```js
const debouncedCallback = debounce(delayInMilliseconds, [executeAtLastCall,] callback);
```

The difference between "trailing" (the default) and "non-trailing" (pass `false` to `executeAtLastCall`) can be visualised as follows, where `|` is a throttled-function call and `X` is the actual callback execution:

```
// > Debounced with `executeAtLastCall` specified as a truthy value or omitted:
// > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
// >                          X                                 X
// >
// > Debounced with `executeAtLastCall` specified as a falsey value:
// > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
// > X                                 X
```

### Distinctions

This is a convenience wrapper that simply passes all of its own arguments to `throttle` with the addition of the value `true` at the end. All distinctions applicable to `throttle` are therefore also applicable here. Furthermore, rather than using `debounce`, you can simply call `throttle` with the addition of the value `true` as the last argument.

### Differences from the original

This is a convenience wrapper that simply passes all of its own arguments to `throttle` with the addition of the value `true` at the end. All differences between this version of `throttle` and the original are therefore also applicable to the two versions of `debounce`.

# Release History

|Version| Release date |Summary|
|-------|--------------|-------|
| 1.0.0 | Jan 02, 2020 | Initial release of nodejs rewrite. Original code by Ben Alman. |

# Original code

See [http://benalman.com/code/projects/jquery-throttle-debounce/docs/](http://benalman.com/code/projects/jquery-throttle-debounce/docs/). This is a rewritten fork based on the original code, not simply a direct port.

# License

## Original code

Copyright (c) 2010 "Cowboy" Ben Alman
Dual licensed under the MIT and GPL licenses.
[http://benalman.com/about/license/](http://benalman.com/about/license/)

## Rewritten fork

The same, unless the original author gets back to me and says I'm allowed to relicense because it's a significant (although admittedly not _total_) rewrite.