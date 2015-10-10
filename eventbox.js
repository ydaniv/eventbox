/*!
 * Eventbox Pub/Sub - simple, tiny and robust.
 * @version 1.0.0
 * @license BSD Clause 2 License (c) copyright Yehonatan Daniv
 * https://raw.github.com/ydaniv/eventbox/master/LICENSE
 *
 */
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(function () {
            return factory(root);
        });
    }
    else if ( typeof exports == 'object' && typeof exports.nodeName !== 'string' ) {
        module.exports = factory(root);
    }
    else {
        root.eventbox = factory(root);
    }
}(this, function (global) {

    var eventbox,
        box = {},
        objToString = global.Object.prototype.toString,
        defaultEmitter = global.setImmediate ? emitImmediate : emitTimeout,
        emit = defaultEmitter;


    function isObj (obj) {
        return objToString.call(obj) == '[object Object]';
    }

    /*
     * Adds a `handler` to `topic`.
     */
    function add (topic, handler) {

        if ( ! (topic in box) ) {
            box[topic] = [];
        }

        box[topic].push(handler);
    }


    /*
     * Removes a `handler` from `topic` or all handlers from `topic`.
     */
    function remove (topic, handler) {

        var handlers = box[topic],
            idx;

        if ( handlers && handlers.length ) {

            if ( typeof handler == 'function' ) {

                idx = handlers.indexOf(handler);

                if ( ~ idx ) {
                    handlers.splice(idx, 1);
                }
            }

            else if ( ! handler ) {
                handlers.length = 0;
            }

        }
    }

    /*
     * Triggers a function with given data using `setImmediate()`
     */
    function emitImmediate (fn, data) {
        setImmediate(function () {
            return fn(data);
        });
    }

    /*
     * Triggers a function with given data using `setTimeout()` with `0` delay.
     */
    function emitTimeout (fn, data) {
        setTimeout(function () {
            return fn(data);
        }, 0);
    }

    return (eventbox = {

        /**
         * Sets the default `emit` function to `fn` or to the original default if not given.
         *
         * The `emit` function takes 2 arguments, the handler and data, and invokes the
         * handler passing the data as argument.
         *
         * Example:
         *
         *     // setting default to emitter to a sync emitter.
         *     eventbox.setDefaultEmitter(function (fn, data) {
         *         fn(data);
         *     });
         *
         *     // revert back to default async emitter.
         *     eventbox.setDefaultEmitter();
         *
         * @param {function} [fn] - `function` to use as default emitter.
         * @returns {Object} eventbox
         */
        setDefaultEmitter: function (fn) {
            emit = fn || defaultEmitter;
            return eventbox;
        },

        /**
         * Publishes a `topic` with the given `data`, or multiple `topic`s with corresponding data.
         *
         * Example:
         *
         *     // publish a specific topic
         *     eventbox.publish('fantasy', { fellowship: 'ring' });
         *
         *     // publish a multiple topics
         *     eventbox.publish({
         *         fantasy: { fellowship: 'ring' },
         *         scifi: { answer: 42 }
         *     });
         *
         * To replace ONCE the `emit` function that will trigger the handler for this `publish()` call
         * invoke this method using your `function` of choice as the context.
         *
         * Example:
         *
         *     // in this example we load asap (https://github.com/kriskowal/asap)
         *     // for yielding execution in next micro-task
         *     var asap = require('asap');
         *
         *     eventbox.publish.call(asap, 'fantasy', { king: 'Aragorn' });
         *
         * You can also generate a new function/method with a special emitter using partial implementation.
         *
         * Example:
         *
         *     // loading the ASAP module
         *     var asap = require('asap');
         *
         *     // creating a special publisher
         *     var publishMicroTask = eventbox.publish.bind(asap);
         *
         *     // we can also set it as a method of eventbox
         *     // eventbox.publishAsap = publishMicroTask;
         *
         *     // now publish a micro task
         *     eventbox.publishAsap('fantasy', { king: 'Aragorn' });
         *
         * @param {string|Object} topic - The topic to publish or a map of topics to publish with corresponding data as values.
         * @param {*} [data] - Data to publish when `topic` is a `string`.
         * @returns {Object} eventbox
         */
        publish: function (topic, data) {
            var emitter = typeof this == 'function' ? this : emit;

            if ( typeof topic == 'string' && box[topic] ) {

                box[topic].forEach(function (h) {
                    emitter(h, data);
                });

            }

            else if ( isObj(topic) ) {

                Object.keys(topic)

                    .forEach(function (t) {

                        var handlers = box[t];

                        if ( handlers ) {

                            handlers.forEach(function (h) {
                                emitter(h, topic[t]);
                            });

                        }
                    });
            }

            return eventbox;
        },

        /**
         * Subscribes a handler to a topic.
         *
         * Example:
         *
         *     eventbox.subscribe('fantasy', tolkienHandler);
         *     // subscribes the tolkienHandler handler to the 'fantasy' topic
         *
         * If `topic` is an `Object` then each of its key-value pairs is used as topic-handler pair to subscribe.
         *
         * Example:
         *
         *     eventbox.subscribe({
         *         fantasy: tolkienHandler,
         *         scifi: adamsHandler
         *     });
         *     // subscribes the tolkienHandler handler for 'fantasy' topic
         *     // subscribes the adamsHandler handler for 'scifi' topic
         *
         * @param {string|Object} topic - A topic to subscribe `handler` to, or a map of `topic`s to subscribe the corresponding handler values to.
         * @param {function} [handler] - A handler to subscribe to `topic` if it's a `string`.
         * @returns {Object} eventbox
         */
        subscribe: function (topic, handler) {

            if ( typeof topic == 'string' ) {

                add(topic, handler);

            }

            else if ( isObj(topic) ) {

                Object.keys(topic)

                    .forEach(function (t) {
                        add(t, topic[t]);
                    });

            }

            return eventbox;
        },

        /**
         * Unsubscribes a handler, or all handlers, from a topic.
         *
         * If `topic` is a `string` and `handler` is not passed then all handlers for that topic are removed.
         *
         * Example:
         *
         *     eventbox.unsubscribe('fantasy');
         *     // removes all handlers for 'fantasy'
         *
         * If `topic` is a `string` and `handler` is a `function` then only that handler is removed.
         *
         * Example:
         *
         *     eventbox.unsubscribe('fantasy', tolkienHandler);
         *     // removes only the tolkienHandler handler for 'fantasy' topic
         *
         * If `topic` is an `Object` then each of its key-value pairs is used as the above.
         * If a value is falsy - `null`/`false`/`undefined` etc. - then all handlers a removed for that topic key.
         *
         * Example:
         *
         *     eventbox.unsubscribe({
         *         fantasy: tolkienHandler,
         *         horror: null
         *     });
         *     // removes only the tolkienHandler handler for 'fantasy' topic
         *     // AND removes all handlers for 'horror'
         *
         * @param {string|Object} topic - A topic to remove handlers from or a map of topics to remove handlers from.
         * @param {function} [handler] - A specific handler to remove for the given `topic`.
         * @returns {Object} eventbox
         */
        unsubscribe: function (topic, handler) {

            if ( typeof topic == 'string' ) {

                remove(topic, handler);

            }

            else if ( isObj(topic) ) {

                Object.keys(topic)

                    .forEach(function (t) {

                        remove(t, topic[t]);

                    });

            }

            return eventbox;
        },

        /**
         * Removes all topics and subscribers.
         *
         * Used mostly as a helper for testing.
         *
         * @returns {Object} eventbox
         */
        unsubscribeAll: function () {
            box = {};
            return eventbox;
        }
    });
}));
