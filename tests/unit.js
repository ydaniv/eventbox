define(function (require) {
    var register = require('intern!object'),
        assert = require('intern/chai!assert'),
        eventbox = require('eventbox');

    register({
        name: 'Methods',

        afterEach: function () {
            eventbox.unsubscribeAll();
            eventbox.setDefaultEmitter();
        },

        'test subscribe single topic and handler': function () {
            var dfd = this.async(10),
                handler = function () {},
                data = {};
            eventbox.subscribe('topic', handler);
            eventbox.publish.call(function (h, d) {
                assert(h === handler,
                    'The subscribed handler is !== as invoked handler');
                assert(d === data,
                    'The data provided to publish is !== from the data passed to the emitting function');
                dfd.resolve();
            }, 'topic', data);
        },
        'test subscribe multiple': function () {
            var dfd = this.async(10, 2),
                handlers = {
                    a: function () {},
                    b: function () {}
                },
                data = {};
            eventbox.subscribe(handlers);
            eventbox.publish.call(function (h, d) {
                assert(h === handlers['a'],
                    'The subscribed handler for `a` is !== as invoked handler');
                assert(d === data,
                    'The data provided to publish `a` is !== from the data passed to the emitting function');
                dfd.resolve();
            }, 'a', data);
            eventbox.publish.call(function (h, d) {
                assert(h === handlers['b'],
                    'The subscribed handler for `b` is !== as invoked handler');
                assert(d === data,
                    'The data provided to publish `b` is !== from the data passed to the emitting function');
                dfd.resolve();
            }, 'b', data);
        },
        'test unsubscribe specific handler': function () {
            var handler = function () {},
                data = {};
            eventbox.subscribe('topic', handler);
            eventbox.unsubscribe('topic', handler);
            eventbox.publish.call(function (h, d) {
                assert(false,
                    'Did not unsubscribe handler');
            }, 'topic', data);
        },
        'test unsubscribe all handlers of specific topic': function () {
            var handler = function () {},
                data = {};
            eventbox.subscribe('topic', handler);
            eventbox.unsubscribe('topic');
            eventbox.publish.call(function (h, d) {
                assert(false,
                    'Did not unsubscribe handler');
            }, 'topic', data);
        },
        'test unsubscribe object of specific handlers': function () {
            var handlers = {
                    a: function () {},
                    b: function () {}
                },
                data = {};
            eventbox.subscribe(handlers);
            eventbox.unsubscribe(handlers);
            eventbox.publish.call(function (h, d) {
                assert(false,
                    'Did not unsubscribe handler for `a`');
            }, 'a', data);
            eventbox.publish.call(function (h, d) {
                assert(false,
                    'Did not unsubscribe handler for `b`');
            }, 'b', data);
        },
        'test unsubscribe object of topics from all handlers': function () {
            var handlers = {
                    a: null,
                    b: false
                },
                data = {};
            eventbox.subscribe(handlers);
            eventbox.unsubscribe(handlers);
            eventbox.publish.call(function (h, d) {
                assert(false,
                    'Did not unsubscribe handler for `a`');
            }, 'a', data);
            eventbox.publish.call(function (h, d) {
                assert(false,
                    'Did not unsubscribe handler for `b`');
            }, 'b', data);
        },
        'test publish single topic': function () {
            var dfd = this.async(20),
                handler = function (d) {
                    assert(d === data,
                        'Data provided to the handler does not match the data published');
                    dfd.resolve();
                },
                data = {};
            eventbox.subscribe('topic', handler);
            eventbox.publish('topic', data);
        },
        'test publish multiple topics': function () {
            var dfd = this.async(50, 2),
                handlers = {
                    a: function (d) {
                        assert(d === data_a,
                            'Data provided to the handler does not match the data published');
                        assert(counter === 1,
                            'Handler for topic `a` was called synchronously');
                        counter = 2;
                        dfd.resolve();
                    },
                    b: function (d) {
                        assert(d === data_b,
                            'Data provided to the handler does not match the data published');
                        assert(counter === 2,
                            'Handler for topic `b` was called synchronously');
                        dfd.resolve();
                    }
                },
                data_a = {},
                data_b = {},
                counter = 0;
            eventbox.subscribe(handlers);
            eventbox.publish({ a: data_a, b: data_b });
            counter = 1;
        },
        'test setDefaultEmitter': function () {
            var handler = function () {},
                data = {};
            eventbox.subscribe('topic', handler);
            eventbox.setDefaultEmitter(function (h, d) {
                assert(h === handler,
                    'The subscribed handler is !== as invoked handler');
                assert(d === data,
                    'The data provided to publish is !== from the data passed to the emitting function');
            });
            eventbox.publish('topic', data);
        }
    });
});
