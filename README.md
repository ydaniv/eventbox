Eventbox
========

Pub/Sub - simple, tiny and robust.

## About

Eventbox.js is a robust yet simple topic-based Pub/Sub library for the browser.
It enables decoupling of modules and keeps you awesome.

Eventbox, by default, invokes each handler in a separate task of the JavaScript engine's Event Loop,
also known as "macro tasks". This ensures that each handler is run in a separate stack and also
allows the browser to render and respond to user/requests input in between calls.

It's possible to customize Eventbox's invocation mechanism to use micro tasks,
e.g. via [ASAP](https://github.com/kriskowal/asap), simple synchronous call, etc.

## Dependencies

Eventbox.js has no dependencies whatsoever.


## Usage

Eventbox uses a UMD wrapper, so you can consume it either as an AMD module, a CommonJS module
or on the global context as `eventbox`.

TBD

## Installing

* Download the source
* Or install via [npm](https://www.npmjs.com/):

```
> npm install eventbox
```

* Or install via [Bower](http://bower.io/):

```
> bower install eventbox
```

## Note on Supported Browsers

Eventbox uses some ES5 functions that can be shimmed:

* `Array.prototype.indexOf()`
* `Array.prototype.forEach()`
* `Object.keys()`

## Testing

Eventbox uses Intern as test runner and Chai for assertions.

To run tests do:

```
> npm test
```

## Contributing

For any question, issue, complaint or praise please **open an issue**. Of course, **pull requests are welcome!**

If you'd really like to help out you can start with one of the following and send a pull request:

* Improve/add unit tests.
* Add integration tests.
* Improve documentation in the README file.
* Add CI integration (Travis?).
* Add coverage integration (Coveralls?).
* Add lovely badges to the README (:
* Write up a nice demo with live code editor.

## License

Eventbox is licensed under the BSD 2-Clause License. Please see the LICENSE file for the full license.

Copyright (c) 2015 Yehonatan Daniv.
