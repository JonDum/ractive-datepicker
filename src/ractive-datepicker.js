
var win = window;
var doc = document;

require('./styles.styl');

var localeStringOptions = {
    month: { month: 'long' },
    weekday: { weekday: 'short' },
    time: { hour: '2-digit', minute: '2-digit' },
};

var animate = require('./util/animate');
//var moment = require('moment');

var debounce = require('lodash/debounce');
var isNil = require('lodash/isNil');



var lastScroll = new Date()
var wheel = function () {
    lastScroll = new Date();
};
if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', wheel, false);
}
window.onmousewheel = document.onmousewheel = wheel;

module.exports = Ractive.extend({

    template: require('template.html'),

    isolated: true,

    decorators: {
        //preventOverscroll: require('./decorators/prevent-overscroll.js'),
        tooltip: require('ractive-tooltip'),
    },

    events: {
        hover: require('ractive-events-hover')
    },

    data: function () {
        var _this = {

            // the selected date
            date: new Date(),

            // start/end dates if in range mode
            range: null, // 'day', 'week', 'month', 'year'
            start: null,
            end: null,

            // "date" or "datetime". Useful if you don't want to select a specific hour/minute.
            mode: 'datetime',
            'weekday-format': 'ddd',
            'min-year': 1990,
            'max-year': 2030,
            // currently viewed year/month
            current: {
                year: 0,
                month: 0,
            },

            editing: 'date',
            years: [],
            hours: Array.apply(0, Array(23 * 3)).map(function (a, i) { return (i % 24) }),
            minutes: Array.apply(0, Array(59 * 3)).map(function (a, i) { return (i % 60) }),

            lastSet: 'end',

            /**
            * Increment minutes by this interval when setting time.
            * @default 1
            * @type integer
            */
            minuteIncrement: 1,

            moment: moment,

            // helpers

            year: function (d) {
                return d.getFullYear();
            },

            month: function (d) {
                return moment(d).format('MMMM');
            },

            hour: function (d) {
                return d.getHours();
            },

            minute: function (d) {
                return d.getMinutes();
            },

            time: function (d) {
                return moment(d).format('LT')
            },

            weekdayShort: function (d) {
                return moment(d).format('ddd');
            },
            weekday: function (d) {
                return moment(d).format(_this['weekday-format']);
            },

            meridiem: function (d) {
                if (d.getHours)
                    d = d.getHours();
                return d < 12 ? 'am' : 'pm';
            },

        }
        return _this;
    },

    computed: {

        // date computations

        currentMonth: function () {
            var current = this.get('current');
            if (current)
                return moment(new Date(current.year, current.month)).format('MMMM');
        },

        currentYear: function () {
            return this.get('current.year');
        },

        daysOfWeek: function () {

            var dow = moment.localeData()._weekdaysMin;
            var fdow = this.get('firstDayOfWeek')

            var firstDayOfWeek = isNil(fdow) ? moment.localeData().firstDayOfWeek() : fdow;

            if (firstDayOfWeek > 0 && firstDayOfWeek < 7) {
                return Array.prototype.concat(dow.slice(firstDayOfWeek), dow.slice(0, firstDayOfWeek));
            }

            return dow;
        },

        dates: function () {

            var current = this.get('current');
            var totalDays = new Date(current.year, current.month, 0).getDate(); // of month
            var firstDayOfMonth = new Date(current.year, current.month, 1).getDay(); // day of week the 1st is on
            var firstDayOfWeek = this.get('firstDayOfWeek'); // default 0, Sunday, configurable

            var days = [];

            if (firstDayOfWeek > 0 && firstDayOfWeek < 7) {
                firstDayOfMonth = firstDayOfMonth - firstDayOfWeek;
                firstDayOfMonth = firstDayOfMonth < 0 ? 7 + firstDayOfMonth : firstDayOfMonth;
            }

            for (var i = 0, j = 1 - firstDayOfMonth; i < 42; i++ , j++)
                //days.push((i >= firstDayOfMonth & i < firstDayOfMonth + totalDays ? new Date(current.year, current.month, j) : ' '));
                days.push(new Date(current.year, current.month, j));

            return days;

        }
    },

    onconfig: function () {

        var self = this;

        var date = self.get('date');
        var range = self.get('range');

        var start = self.get('start');
        var end = self.get('end');

        if (!date) {
            date = new Date();
            if (!range)
                self.set('date', date);
        }

        function isAfter(start, end) {
            return start.getTime() < end.getTime();
        }

        if (range) {
            if (!start) {
                start = date;
                self.set('start', start);
            }
            if (end === undefined || (end && !moment(start).isAfter(end))) {
                end = new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000); // default to 3 days after
                self.set('end', end);
            }
        }

        // update current
        self.set('current.month', date.getMonth());
        self.set('current.year', date.getFullYear());

        var minYear = self.get('min-year');
        var maxYear = self.get('max-year');
        var diff = maxYear - minYear;
        var years = Array.apply(0, Array((diff + 1) * 3)).map(function (a, i) { return (minYear + i % diff) });
        self.set('years', years);
    },

    oninit: function () {
        var self = this;

        self.on('decrementMonth', function (details) {
            var current = this.get('current');
            current.month--;
            if (current.month < 0) {
                current.month = 11;
                current.year--;
            }
            this.set('current', current);
        });

        self.on('incrementMonth', function (details) {
            var current = this.get('current');
            current.month++;
            if (current.month > 11) {
                current.month = 0;
                current.year++;
            }
            this.set('current', current);
        });

        self.on('setDate', function (details) {

            var clicked = details.get();

            var current = self.get('current');
            var date = self.get('date');
            var range = self.get('range');
            var start = self.get('start');
            var end = self.get('end');

            var lastSet = self.get('lastSet');

            // store these so we can restore them later
            var hours = date.getHours();
            var minutes = date.getMinutes();

            if (range) {

                date = clicked;

                date.setHours(hours);
                date.setMinutes(minutes);


                if (lastSet == 'end' || moment(clicked).isBefore(start)) {

                    self.set('start', date);

                    self.fire('startChange');

                    self.set('current.year', clicked.getFullYear());
                    self.set('current.month', clicked.getMonth());

                    self.set('end', null);
                    self.set('lastSet', 'start');

                } else {

                    self.set('lastSet', 'end');
                    self.set('end', date);
                    self.fire('endChange');
                    self.set('ghostEnd', null);

                }


            } else {

                date = clicked;

                date.setHours(hours);
                date.setMinutes(minutes);

                self.set('current.year', clicked.getFullYear());
                self.set('current.month', clicked.getMonth());

                self.set('date', date);

            }

        });

        self.on('setYear', function (details) {
            var date = self.get('date');
            if (details.context)
                date.setFullYear(details.context);
            self.set('date', date);
            self.set('current.year', details.context);
            setPosition('.years');
        });

        self.on('fixYear', function (details) {
            self.fire('setYear', details);
            self.set('editing', 'date');
        });

        self.on('setHours', function (details) {
            details.context = details.context % 24;
            var date = self.get('date');
            date.setHours(details.context);
            self.set('date', date);
            self.set('editing', 'time');
            setPosition('.hours');
        });

        self.on('setMinutes', function (details) {
            console.warn("setMinutes", details);
            details.context = details.context % 60;
            var date = self.get('date');
            date.setMinutes(details.context);
            self.set('date', date);
            self.set('editing', 'time');
            setPosition('.minutes');
        });

        self.observe('editing', function (editing) {
            setTimeout(function () {
                console.warn("editing:", editing);
                if (editing.indexOf('year') > -1) {
                    setPosition('.years');
                }
                if (editing.indexOf('time') > -1) {
                    setPosition('.hours');
                    setPosition('.minutes');
                }
            });
        }, { init: false, defer: true });

        self.observe('mode', function (newMode) {

            var editing = self.get('editing');

            if (newMode == 'date' && editing == 'time')
                editing = 'date';

            if (newMode == 'time' && (editing == 'date' || editing == 'year'))
                editing = 'time';

            self.set('editing', editing);

        }, { defer: true });

        self.observe('start end', function () {
            self.set('ghostEnd', null);
        });

        function setPosition(selector) {
            var element = self.find(selector);
            var actives = self.findAll(selector + ' .active');
            var active = actives[1];
            if (!active)
                return;
            var styles = window.getComputedStyle(self.find('.editor'));
            var offset = parseInt(styles.paddingTop, 10);
            console.info(offset);
            offset = -offset;
            element.scrollTop = active.offsetTop - element.offsetHeight / 2 + active.clientHeight / 2 + offset;
        }

        function snap(node, method, value) {
            if (!node)
                return;

            if (new Date().getTime() - lastScroll.getTime() < 500) {
                debouncedSnap(node, method);
                return;
            }

            var div = node.querySelector('div');
            if (!div)
                return;

            var divHeight = div.offsetHeight + parseFloat(window.getComputedStyle(div).marginBottom);
            var index = Math.round(node.scrollTop / divHeight + node.offsetHeight / divHeight / 2 - .5);
            self.fire(method, { context: Number(node.children[index].textContent) });
        }

        var debouncedSnap = debounce(snap, 250);

        self.on('wheel', function (details, method) {
            var event = details.original;

            if (method == 'setHours') {
                var hours = self.find('.hours');
                var actives = self.findAll('.hours .active');
                if (hours.scrollTop >= (actives[1].offsetTop - actives[0].offsetTop) * 2) {
                    hours.scrollTop = hours.scrollTop - (actives[1].offsetTop - actives[0].offsetTop);
                }
                else if (hours.scrollTop <= (actives[1].offsetTop - actives[0].offsetTop)) {
                    hours.scrollTop = hours.scrollTop + (actives[1].offsetTop - actives[0].offsetTop);
                }
            }
            if (method == 'setMinutes') {
                var minutes = self.find('.minutes');
                var act = self.findAll('.minutes .active');
                if (minutes.scrollTop >= (act[1].offsetTop - act[0].offsetTop) * 2) {
                    minutes.scrollTop = minutes.scrollTop - (act[1].offsetTop - act[0].offsetTop);
                }
                else if (minutes.scrollTop <= (act[1].offsetTop - act[0].offsetTop)) {
                    minutes.scrollTop = minutes.scrollTop + (act[1].offsetTop - act[0].offsetTop);
                }
            }
            debouncedSnap(details.node, method);
        });

        /* --------------------- */
        // time editor stuff
        /* --------------------- */
        /*
                var animating = {};
                var meridiem = self.get('meridiem');
        
                function snap(node, method, value) {
        
                    var startY = node.scrollTop;
        
                    // no node, nothing to do
                    if (!node) {
                        return;
                    }
        
                    // grab the first div and use to size
                    var div = node.querySelector('div');
        
                    // the dom has been destroyed by the time the debounce
                    // has happened, so just return
                    if (!div)
                        return;
        
                    //console.log('snap() ', arguments);
        
                    var styles = window.getComputedStyle(div);
                    var divHeight = div.offsetHeight + parseFloat(styles.marginBottom);
        
                    var index;
        
                    if (!isNil(value)) {
        
                        // we're scrolling to a specific value passed in
                        index = value;
        
                        // account for > 12 hours (pm)
                        if (method == 'setHours' && value >= 12)
                            index -= 12;
        
                    } else {
                        // figure out the closest div to where we scrolled
                        index = Math.round(startY / divHeight);
                    }
        
                    if (index >= node.children.length)
                        index = node.children.length - 1;
        
                    div = node.children[index];
        
                    var endY = div.offsetTop - divHeight - parseFloat(styles.marginTop) / 2 - parseFloat(styles.marginBottom) / 2;
                    //var endY = divHeight*index + parseFloat(styles.marginBottom)/4;
                    var deltaY = endY - startY;
        
                    // block the animation on subsequent calls
                    // from the scroll event handler
                    // but don't block is we're calling it direclty
                    // with a value
                    if (animating[method] && isNil(value))
                        return;
        
                    animating[method] = animate({
                        duration: 0.3,
                        step: function (p) {
                            node.scrollTop = startY + deltaY * p;
                        },
                        complete: function () {
                            var editing = self.get('editing').replace('time', '') || 'date';
                            var date = self.get(editing);
        
                            var value = parseInt(div.textContent);
        
                            if (method == 'setHours') {
                                if (meridiem(value) == 'pm' && value !== 12)
                                    value += 12;
                                if (meridiem(value) == 'am' && value == 12)
                                    value = 0;
                            }
        
                            date[method](value);
        
                            self.set(editing, date);
                            animating[method] = false;
                            //console.log('complete: animating=', animating);
                        }
                    });
        
                    animating[method].animating = true;
        
                }
        */
        // needs to be debounced so that the UI is fully updated
        // defer: true doesn't count it on the obserer

        /*
        updateTimeEditors = debounce(updateTimeEditors, 10);
                // update scroll positions of clock editors when first viewed
                self.observe('editing', updateTimeEditors, { init: false, defer: true });
                // update scroll positions of clock editors when date changes
                self.observe('date', updateTimeEditors, { init: false });
        
                function updateTimeEditors() {
        
                    if (self.get('editing').indexOf('time') < 0)
                        return;
        
                    for (var key in animating)
                        if (animating[key])
                            return;
        
                    var editing = self.get('editing').replace('time', '') || 'date';
                    var date = self.get(editing);
        
                    //snap(self.find('.clock .hours'), 'setHours', date.getHours());
                    //snap(self.find('.clock .minutes'), 'setMinutes', date.getMinutes());
                }
        */
        /*
                var debouncedSnap = debounce(snap, 250);
        
                self.on('clockwheel', function (details, method) {
                    var event = details.original;
        
                    for (var key in animating)
                        if (animating[key].cancel)
                            animating[key].cancel()
        
                    animating = {};
        
                    debouncedSnap(details.node, method);
                });
        */
    },

    // prevent computation errors for weird
    date: function () {
        var d = this.get('date');
        if (d instanceof Date)
            return d;
    }

});

