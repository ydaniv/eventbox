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

Evenbox looks for `setImmediate` on the global object and uses it if found. Otherwise it falls back to using
`setTimeout(..., 0)`. If you really value every millisecond you can
polyfill it using [YuzuJS](https://github.com/YuzuJS/setImmediate).

## Dependencies

Eventbox.js has no dependencies whatsoever.


## Usage

Eventbox uses a UMD wrapper, so you can consume it either as an AMD module, a CommonJS module
or on the global object as `eventbox`.

### Simple Example

    var eventbox = require('eventbox');
    var log = function (data) {
        console.log(data);
    };

    eventbox.subscribe('topic_1', log);
    eventbox.publish('topic_1', 'shalom');
    // logs 'shalom'

### API Reference

#### `subscribe(topic, handler)`

Subscribes `handler` to `topic`, or multiple handlers to corresponding topics.

*Example*:

    eventbox.subscribe('fantasy', tolkienHandler);
    // subscribes the tolkienHandler handler to the 'fantasy' topic

If `topic` is an `Object` then each of its key-value pairs is used as topic-handler pair to subscribe.

*Example*:

    eventbox.subscribe({
        fantasy: tolkienHandler,
        scifi: adamsHandler
    });
    // subscribes the tolkienHandler handler for 'fantasy' topic
    // subscribes the adamsHandler handler for 'scifi' topic

#### `publish(topic [, data])`

Publishes a `topic` with the given `data`, or multiple `topic`s with corresponding data.

*Example*:

    // publish a specific topic
    eventbox.publish('fantasy', { fellowship: 'ring' });

    // publish a multiple topics
    eventbox.publish({
        fantasy: { fellowship: 'ring' },
        scifi: { answer: 42 }
    });

To replace the `emitter` function that will trigger the handler for this `publish()` call *ONCE*
invoke this method using your `function` of choice as the **context**.

*Example*:

    // in this example we load asap (https://github.com/kriskowal/asap)
    // for yielding execution in next micro-task
    var asap = require('asap');

    eventbox.publish.call(asap, 'fantasy', { king: 'Aragorn' });

You can also generate a new function/method with a special emitter using partial implementation (`.bind()`).

*Example*:

    // loading the ASAP module
    var asap = require('asap');

    // creating a special publisher
    var publishMicroTask = eventbox.publish.bind(asap);

    // we can also set it as a method of eventbox
    // eventbox.publishAsap = publishMicroTask;

    // now publish a micro task
    eventbox.publishAsap('fantasy', { king: 'Aragorn' });

#### `unsubscribe(topic [, handler])`

Unsubscribes a handler, or all handlers, from `topic`.

If `topic` is a `string` and `handler` is not passed then all handlers for that topic are removed.

*Example*:

    eventbox.unsubscribe('fantasy');
    // removes all handlers for 'fantasy'

If `topic` is a `string` and `handler` is a `function` then only that handler is removed.

*Example*:

    eventbox.unsubscribe('fantasy', tolkienHandler);
    // removes only the tolkienHandler handler for 'fantasy' topic

If `topic` is an `Object` then each of its key-value pairs is used as the above.
If a value is falsy - `null`/`false`/`undefined` etc. - then all handlers for that topic key are removed.

*Example*:

    eventbox.unsubscribe({
        fantasy: tolkienHandler,
        horror: null
    });
    // removes only the tolkienHandler handler for 'fantasy' topic
    // AND removes all handlers for 'horror'

#### `setDefaultEmitter([fn])`

Sets the default `emitter` function to `fn`, if that argument is passed.

If called without arguments (or `null`) it restores the default `emitter` to eventbox's default `emitter` function,
which is either using `setImmediate(...)` if it's present on the global object, or `setTimeout(... , 0)`.

An `emitter` function is a `function` in the form of `(handler, data) => handler(data)`. The way you wrap the
invocation of `handler`, or if you wrap it at all, is up to you.

*Example*:

    // setting default to emitter to a sync emitter.
    eventbox.setDefaultEmitter(function (fn, data) {
        fn(data);
    });
    // revert back to default async emitter.
    eventbox.setDefaultEmitter();

#### `unsubscribeAll()`

Discards all subscriptions. This is usually used for testing.

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
