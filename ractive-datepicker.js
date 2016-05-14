(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RactiveDatepicker"] = factory();
	else
		root["RactiveDatepicker"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

    __webpack_require__( 1 );

    var localeStringOptions = {
        month: {
            month: 'long'
        },
        weekday: {
            weekday: 'short'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit'
        },
    };

    var debounce = __webpack_require__( 5 );
    var animate = __webpack_require__( 12 );
    var isUndefined = __webpack_require__( 14 );

    module.exports = Ractive.extend( {

        template: __webpack_require__( 15 ),

        isolated: true,

        decorators: {
            preventOverscroll: __webpack_require__( 16 ),
        },

        data: function () {
            return {

                // the selected date
                date: new Date(),

                // currently viewed year/month
                current: {
                    year: 0,
                    month: 0,
                },

                mode: 'datetime',
                editing: 'date',

                format: '',

                years: Array.apply( 0, Array( 201 ) ).map( function ( a, i ) {
                    return 1900 + i
                } ),
                hours: [ 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],

                /**
                 * Increment minutes by this interval when setting time.
                 * @default 1
                 * @type integer
                 */
                minuteIncrement: 1,
            }
        },

        computed: {

            // date computations

            year: function () {
                var d = this.date();
                if ( d )
                    return d.getFullYear();
            },

            month: function () {
                var d = this.date();
                if ( d )
                    return d.toLocaleString( navigator.language, localeStringOptions.month );
            },

            currentMonth: function () {
                var current = this.get( 'current' );
                return new Date( current.year, current.month ).toLocaleString( navigator.language, localeStringOptions.month );
            },

            currentYear: function () {
                return this.get( 'current.year' );
            },

            weekday: function () {
                var d = this.date();
                if ( d )
                    return d.toLocaleString( navigator.language, localeStringOptions.weekday );
            },

            meridiem: function () {
                var d = this.date();
                if ( d )
                    return d.getHours() < 12;
            },

            daysOfWeek: function () {

                var dow = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];

                var firstDayOfWeek = this.get( 'firstDayOfWeek' ); // default 0, Sunday, configurable

                if ( firstDayOfWeek > 0 && firstDayOfWeek < 7 ) {
                    return Array.prototype.concat( dow.slice( firstDayOfWeek ), dow.slice( 0, firstDayOfWeek ) );
                }

                return dow;
            },

            dates: function () {

                var current = this.get( 'current' );
                var totalDays = new Date( current.year, current.month, 0 ).getDate(); // of month
                var firstDayOfMonth = new Date( current.year, current.month, 1 ).getDay(); // day of week the 1st is on
                var firstDayOfWeek = this.get( 'firstDayOfWeek' ); // default 0, Sunday, configurable

                var days = [];

                if ( firstDayOfWeek > 0 && firstDayOfWeek < 7 ) {
                    firstDayOfMonth = firstDayOfMonth - firstDayOfWeek;
                    firstDayOfMonth = firstDayOfMonth < 0 ? 7 + firstDayOfMonth : firstDayOfMonth;
                }

                for ( var i = 0, j = 1 - firstDayOfMonth; i < 42; i++, j++ )
                    days.push( ( i >= firstDayOfMonth & i < firstDayOfMonth + totalDays ? j : ' ' ) );

                return days;

            },


            // time computations

            time: function () {
                var d = this.date();
                if ( d )
                    return d.toLocaleTimeString( navigator.language, localeStringOptions.time );
            },

            hour: function () {
                var d = this.date();
                if ( d )
                    return d.getHours();
            },

            minute: function () {
                var d = this.date();
                if ( d )
                    return d.getMinutes();
            },

            // 0 - 60
            minutes: function () {
                var n = this.get( 'minuteIncrement' );
                return Array.apply( 0, Array( 60 / n ) ).map( function ( a, i ) {
                    return n * i
                } );
            },

            meridiem: function () {
                var d = this.date();
                if ( d )
                    return d.getHours() < 12 ? 'am' : 'pm';
            }


        },

        oninit: function () {
            var self = this;

            var date = self.get( 'date' );

            if ( !date ) {
                date = new Date();
                self.set( 'date', date );
            }

            // update current
            self.set( 'current.month', date.getMonth() );
            self.set( 'current.year', date.getFullYear() );

            self.on( 'decrementMonth', function ( details ) {
                var current = this.get( 'current' );
                current.month--;
                if ( current.month < 0 ) {
                    current.month = 11;
                    current.year--;
                }
                this.set( 'current', current );
            } );

            self.on( 'incrementMonth', function ( details ) {
                var current = this.get( 'current' );
                current.month++;
                if ( current.month > 11 ) {
                    current.month = 0;
                    current.year++;
                }
                this.set( 'current', current );
            } );

            self.on( 'decrementYear', function ( details ) {
                var current = this.get( 'current' );
                current.year--;
                this.set( 'current', current );
                this.fire( 'setDate' );
            } );

            self.on( 'incrementYear', function ( details ) {
                var current = this.get( 'current' );
                current.year++;
                this.set( 'current', current );
                this.fire( 'setDate' );
            } );

            self.on( 'setDate', function ( details ) {
                var date = this.get( 'date' );
                var current = this.get( 'current' );
                date.setYear( current.year );
                date.setMonth( current.month );
                details && date.setDate( details.context );
                self.set( 'date', date );
            } );

            self.on( 'setYear', function ( details ) {
                var date = this.get( 'date' );
                date.setFullYear( details.context );
                self.set( 'date', date );
                self.set( 'current.year', details.context );
                self.set( 'editing', 'date' );
            } );

            self.on( 'setMeridiem', function ( details, meridiem ) {
                var date = this.get( 'date' );
                var hours = date.getHours();
                if ( hours <= 12 && meridiem == 'pm' )
                    date.setHours( hours + 12 );
                else if ( hours >= 12 && meridiem == 'am' )
                    date.setHours( hours - 12 );
                self.set( 'date', date );
            } );



            self.observe( 'mode', function ( newMode ) {

                var editing = self.get( 'editing' );

                if ( newMode == 'date' && editing == 'time' )
                    editing = 'date';

                if ( newMode == 'time' && ( editing == 'date' || editing == 'year' ) )
                    editing = 'time';

                self.set( 'editing', editing );

            }, {
                defer: true
            } );


            /* --------------------- */
            // time editor stuff
            /* --------------------- */

            var animating = {};

            function snap( node, method, value ) {
                // no node, nothing to do
                if ( !node ) {
                    return;
                }
                // block the animation on subsequent calls
                // from the scroll event handler
                // but don't block is we're calling it direclty
                // with a value but do block if that value is the same as the last value
                if ( animating[ method ] && value == animating[ method ].lastValue ) {
                    return;
                }
                var startY = node.scrollTop;
                // grab the first div and use to size
                var div = node.querySelector( 'div' );

                // the dom has been destroyed by the time the debounce
                // has happened, so just return
                if ( !div ) {
                    return;
                }

                var styles = window.getComputedStyle( div );
                var divHeight = div.offsetHeight + parseFloat( styles.marginBottom );
                var index;
                var meridiem = self.get( 'meridiem' );

                if ( !isUndefined( value ) ) {

                    // we're scrolling to a specific value passed in
                    // if that value is a year then subtract 1900 to get its index
                    index = ( method == 'setYear' && value ? value - 1900 : value );
                    // account for > 12 hours (pm)
                    if ( method == 'setHours' && meridiem == 'pm' && value >= 12 )
                        index -= 12;

                } else {
                    // figure out the closest div to where we scrolled
                    index = Math.round( startY / divHeight );
                }


                if ( index >= node.children.length )
                    index = node.children.length - 1;
                div = node.children[ index ];

                var endY = div.offsetTop - ( divHeight * ( ( method == 'setYear' ) && !isUndefined( value ) ? 3 : 1 ) ) - parseFloat( styles.marginTop ) / 2 - parseFloat( styles.marginBottom ) / 2;
                var deltaY = endY - startY;




                animating[ method ] = animate( {
                    duration: 0.3,
                    step: function ( p ) {
                        node.scrollTop = startY + deltaY * p;
                    },
                    complete: function () {
                        var date = self.get( 'date' );
                        var value = parseInt( div.textContent );
                        if ( method == 'setHours' ) {
                            var meridiem = self.get( 'meridiem' );
                            if ( meridiem == 'pm' && value !== 12 )
                                value += 12;
                            if ( meridiem == 'am' && value == 12 )
                                value = 0;
                        }

                        date[ method ]( value );

                        self.set( 'date', date );
                        animating[ method ] = {
                            lastValue: value
                        };
                    }
                } );

                animating[ method ].animating = true;

            }

            // needs to be debounced so that the UI is fully updated
            // defer: true doesn't count it on the obserer
            updateTimeEditors = debounce( updateTimeEditors, 10 );

            // update scroll positions of clock editors when first viewed
            self.observe( 'editing', updateTimeEditors, {
                init: false,
                defer: true
            } );
            // update scroll positions of clock editors when date changes
            self.observe( 'date', updateTimeEditors, {
                init: false
            } );

            function updateTimeEditors( changeOfView ) {
                var cur = {
                    setHours: self.get( 'hour' ),
                    setMinutes: self.get( 'minute' ),
                    setYear: self.get( 'year' )
                };
                if ( changeOfView == 'year' ) {
                    //now in the change year view so we delete hours and minutes animatition
                    delete animating.setHours;
                    delete animating.setMinutes;
                }
                if ( changeOfView == 'time' ) {
                    delete animating.setYear;
                }

                for ( var key in animating ) {
                    if ( animating[ key ].animating === true || animating[ key ].lastValue == cur[ key ] ) {
                        return;
                    }
                }
                if ( changeOfView == 'time' ) {
                    snap( self.find( '.clock .hours' ), 'setHours', self.get( 'hour' ) );
                    snap( self.find( '.clock .minutes' ), 'setMinutes', self.get( 'minute' ) );
                    return;
                }
                if ( changeOfView == 'year' ) {
                    snap( self.find( '.years' ), 'setYear', self.get( 'year' ) );
                    return;
                }


            }


            var debouncedSnap = debounce( snap, 250 );

            self.on( 'clockwheel', function ( details, method ) {
                for ( var key in animating )
                    if ( animating[ key ].cancel )
                        animating[ key ].cancel()

                animating = {};

                debouncedSnap( details.node, method );
            } );

        },

        // prevent computation errors for weird 
        date: function () {
            var d = this.get( 'date' );
            if ( d instanceof Date )
                return d
        }

    } );


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

    // style-loader: Adds some css to the DOM by adding a <style> tag

    // load the styles
    var content = __webpack_require__(2);
    if(typeof content === 'string') content = [[module.id, content, '']];
    // add the styles to the DOM
    var update = __webpack_require__(4)(content, {});
    if(content.locals) module.exports = content.locals;
    // Hot Module Replacement
    if(false) {
    	// When the styles change, update the <style> tags
    	if(!content.locals) {
    		module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./styles.styl", function() {
    			var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./styles.styl");
    			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
    			update(newContent);
    		});
    	}
    	// When the module is disposed, remove the <style> tags
    	module.hot.dispose(function() { update(); });
    }

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

    exports = module.exports = __webpack_require__(3)();
    // imports


    // module
    exports.push([module.id, ".ractive-datepicker {\n  display: inline-flex;\n  flex-direction: row;\n  background: #fff;\n}\n.ractive-datepicker,\n.ractive-datepicker *,\n.ractive-datepicker *:before,\n.ractive-datepicker *:after {\n  box-sizing: border-box;\n}\n.ractive-datepicker .header {\n  background: #333;\n  color: rgba(255,255,255,0.5);\n  padding: 2em;\n  min-width: 11em;\n  position: relative;\n  text-align: left;\n}\n.ractive-datepicker .header > div {\n  cursor: pointer;\n}\n.ractive-datepicker .header .active {\n  color: #fff;\n  position: relative;\n}\n.ractive-datepicker .header .active:after {\n  content: '';\n  display: inline-block;\n  border: 10px solid transparent;\n  border-right-color: #fff;\n  position: absolute;\n  right: -2em;\n  top: 50%;\n  margin-top: -10px;\n}\n.ractive-datepicker .header .weekday {\n  font-size: 2em;\n}\n.ractive-datepicker .header .time {\n  margin-top: 2em;\n}\n.ractive-datepicker .editor {\n  flex: 1 1 66%;\n  padding: 2em;\n  position: relative;\n  user-select: none;\n}\n.ractive-datepicker .editor .years:after,\n.ractive-datepicker .editor .clock:after {\n  position: absolute;\n  content: '';\n  top: 1em;\n  left: 0;\n  right: 0;\n  bottom: 1em;\n  pointer-events: none;\n}\n.ractive-datepicker .editor .years:after {\n  background: linear-gradient(#fff, rgba(255,255,255,0), #fff);\n}\n.ractive-datepicker .editor .clock:after {\n  background: linear-gradient(#fff 20%, rgba(255,255,255,0), #fff 80%);\n}\n.ractive-datepicker .monthyear {\n  font-weight: bold;\n  text-align: center;\n  margin-bottom: 1em;\n}\n.ractive-datepicker .monthyear span {\n  cursor: pointer;\n}\n.ractive-datepicker .nav .next,\n.ractive-datepicker .nav .previous {\n  user-select: none;\n  position: absolute;\n  padding: 0.5em;\n  display: inline-block;\n  cursor: pointer;\n  top: 1.5em;\n}\n.ractive-datepicker .nav .next.up,\n.ractive-datepicker .nav .previous.up {\n  position: relative;\n  top: 0;\n  right: 0;\n  left: 50%;\n}\n.ractive-datepicker .nav .next.up:before,\n.ractive-datepicker .nav .previous.up:before {\n  content: '\\25B2';\n}\n.ractive-datepicker .nav .next.down,\n.ractive-datepicker .nav .previous.down {\n  position: relative;\n  top: 0;\n  right: 0;\n  left: 50%;\n}\n.ractive-datepicker .nav .next.down:before,\n.ractive-datepicker .nav .previous.down:before {\n  content: '\\25BC';\n}\n.ractive-datepicker .nav .previous {\n  left: 2.5em;\n}\n.ractive-datepicker .nav .previous:before {\n  content: '<';\n}\n.ractive-datepicker .nav .next {\n  right: 2.5em;\n}\n.ractive-datepicker .nav .next:before {\n  content: '>';\n}\n.ractive-datepicker .weekdays {\n  display: flex;\n  opacity: 0.4;\n}\n.ractive-datepicker .dates > div,\n.ractive-datepicker .weekdays > div {\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  margin: 0.5em;\n  text-align: center;\n  line-height: 2em;\n  vertical-align: top;\n  cursor: pointer;\n}\n.ractive-datepicker .dates {\n  max-width: 21em;\n  margin-bottom: -0.5em;\n}\n.ractive-datepicker .years,\n.ractive-datepicker .clock {\n  width: 21em;\n  height: 21em;\n}\n.ractive-datepicker .dates .active {\n  background: #0097a7;\n  color: #fff;\n  border-radius: 50%;\n}\n.ractive-datepicker .years {\n  overflow-y: scroll;\n  text-align: center;\n}\n.ractive-datepicker .years::-webkit-scrollbar {\n  display: none;\n}\n.ractive-datepicker .years div {\n  font-size: 1.4em;\n  margin: 1em 0;\n  cursor: pointer;\n}\n.ractive-datepicker .years div.active {\n  font-weight: bold;\n  margin: 0.5em 0;\n  display: inline-block;\n  cursor: default;\n}\n.ractive-datepicker .clock {\n  display: flex;\n  flex-direction: row;\n  text-align: right;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n  line-height: 1;\n}\n.ractive-datepicker .clock > div {\n  font-size: 1.5em;\n}\n.ractive-datepicker .clock .minutes,\n.ractive-datepicker .clock .hours {\n  overflow-y: scroll;\n  max-height: 22em;\n  user-select: none;\n  padding: 0 1em;\n  cursor: default;\n}\n.ractive-datepicker .clock .minutes::-webkit-scrollbar,\n.ractive-datepicker .clock .hours::-webkit-scrollbar {\n  display: none;\n}\n.ractive-datepicker .clock .minutes div,\n.ractive-datepicker .clock .hours div {\n  user-select: none;\n  cursor: default;\n  margin-bottom: 0.88em;\n}\n.ractive-datepicker .clock .minutes div:first-child {\n  margin-top: 11em;\n}\n.ractive-datepicker .clock .minutes div:last-child {\n  margin-bottom: 11em;\n}\n.ractive-datepicker .clock .hours div:first-child {\n  margin-top: 11em;\n}\n.ractive-datepicker .clock .hours div:last-child {\n  margin-bottom: 11em;\n}\n.ractive-datepicker .clock .meridiem {\n  cursor: pointer;\n}\n.ractive-datepicker .clock .meridiem span:not(.selected) {\n  opacity: 0.2;\n}\n@media (max-width: 700px) {\n  .ractive-datepicker {\n    flex-direction: column;\n    font-size: 0.8em;\n  }\n  .ractive-datepicker .header {\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end;\n    padding: 1.5em;\n  }\n  .ractive-datepicker .header .weekday {\n    font-size: 1em;\n  }\n  .ractive-datepicker .header div {\n    display: inline;\n  }\n  .ractive-datepicker .header > div {\n    margin-top: 0 !important;\n    margin-right: 1em;\n  }\n  .ractive-datepicker .header .active:after {\n    border-right-color: transparent;\n    border-bottom-color: #fff;\n    left: 50%;\n    right: auto;\n    bottom: -1.5em;\n    margin-top: 0;\n    margin-left: -10px;\n  }\n}\n", ""]);

    // exports


/***/ },
/* 3 */
/***/ function(module, exports) {

    /*
    	MIT License http://www.opensource.org/licenses/mit-license.php
    	Author Tobias Koppers @sokra
    */
    // css base code, injected by the css-loader
    module.exports = function() {
    	var list = [];

    	// return the list of modules as css string
    	list.toString = function toString() {
    		var result = [];
    		for(var i = 0; i < this.length; i++) {
    			var item = this[i];
    			if(item[2]) {
    				result.push("@media " + item[2] + "{" + item[1] + "}");
    			} else {
    				result.push(item[1]);
    			}
    		}
    		return result.join("");
    	};

    	// import a list of modules into the list
    	list.i = function(modules, mediaQuery) {
    		if(typeof modules === "string")
    			modules = [[null, modules, ""]];
    		var alreadyImportedModules = {};
    		for(var i = 0; i < this.length; i++) {
    			var id = this[i][0];
    			if(typeof id === "number")
    				alreadyImportedModules[id] = true;
    		}
    		for(i = 0; i < modules.length; i++) {
    			var item = modules[i];
    			// skip already imported module
    			// this implementation is not 100% perfect for weird media query combinations
    			//  when a module is imported multiple times with different media queries.
    			//  I hope this will never occur (Hey this way we have smaller bundles)
    			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
    				if(mediaQuery && !item[2]) {
    					item[2] = mediaQuery;
    				} else if(mediaQuery) {
    					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
    				}
    				list.push(item);
    			}
    		}
    	};
    	return list;
    };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

    /*
    	MIT License http://www.opensource.org/licenses/mit-license.php
    	Author Tobias Koppers @sokra
    */
    var stylesInDom = {},
    	memoize = function(fn) {
    		var memo;
    		return function () {
    			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
    			return memo;
    		};
    	},
    	isOldIE = memoize(function() {
    		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
    	}),
    	getHeadElement = memoize(function () {
    		return document.head || document.getElementsByTagName("head")[0];
    	}),
    	singletonElement = null,
    	singletonCounter = 0,
    	styleElementsInsertedAtTop = [];

    module.exports = function(list, options) {
    	if(true) {
    		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
    	}

    	options = options || {};
    	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
    	// tags it will allow on a page
    	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

    	// By default, add <style> tags to the bottom of <head>.
    	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

    	var styles = listToStyles(list);
    	addStylesToDom(styles, options);

    	return function update(newList) {
    		var mayRemove = [];
    		for(var i = 0; i < styles.length; i++) {
    			var item = styles[i];
    			var domStyle = stylesInDom[item.id];
    			domStyle.refs--;
    			mayRemove.push(domStyle);
    		}
    		if(newList) {
    			var newStyles = listToStyles(newList);
    			addStylesToDom(newStyles, options);
    		}
    		for(var i = 0; i < mayRemove.length; i++) {
    			var domStyle = mayRemove[i];
    			if(domStyle.refs === 0) {
    				for(var j = 0; j < domStyle.parts.length; j++)
    					domStyle.parts[j]();
    				delete stylesInDom[domStyle.id];
    			}
    		}
    	};
    }

    function addStylesToDom(styles, options) {
    	for(var i = 0; i < styles.length; i++) {
    		var item = styles[i];
    		var domStyle = stylesInDom[item.id];
    		if(domStyle) {
    			domStyle.refs++;
    			for(var j = 0; j < domStyle.parts.length; j++) {
    				domStyle.parts[j](item.parts[j]);
    			}
    			for(; j < item.parts.length; j++) {
    				domStyle.parts.push(addStyle(item.parts[j], options));
    			}
    		} else {
    			var parts = [];
    			for(var j = 0; j < item.parts.length; j++) {
    				parts.push(addStyle(item.parts[j], options));
    			}
    			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
    		}
    	}
    }

    function listToStyles(list) {
    	var styles = [];
    	var newStyles = {};
    	for(var i = 0; i < list.length; i++) {
    		var item = list[i];
    		var id = item[0];
    		var css = item[1];
    		var media = item[2];
    		var sourceMap = item[3];
    		var part = {css: css, media: media, sourceMap: sourceMap};
    		if(!newStyles[id])
    			styles.push(newStyles[id] = {id: id, parts: [part]});
    		else
    			newStyles[id].parts.push(part);
    	}
    	return styles;
    }

    function insertStyleElement(options, styleElement) {
    	var head = getHeadElement();
    	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
    	if (options.insertAt === "top") {
    		if(!lastStyleElementInsertedAtTop) {
    			head.insertBefore(styleElement, head.firstChild);
    		} else if(lastStyleElementInsertedAtTop.nextSibling) {
    			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
    		} else {
    			head.appendChild(styleElement);
    		}
    		styleElementsInsertedAtTop.push(styleElement);
    	} else if (options.insertAt === "bottom") {
    		head.appendChild(styleElement);
    	} else {
    		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
    	}
    }

    function removeStyleElement(styleElement) {
    	styleElement.parentNode.removeChild(styleElement);
    	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
    	if(idx >= 0) {
    		styleElementsInsertedAtTop.splice(idx, 1);
    	}
    }

    function createStyleElement(options) {
    	var styleElement = document.createElement("style");
    	styleElement.type = "text/css";
    	insertStyleElement(options, styleElement);
    	return styleElement;
    }

    function createLinkElement(options) {
    	var linkElement = document.createElement("link");
    	linkElement.rel = "stylesheet";
    	insertStyleElement(options, linkElement);
    	return linkElement;
    }

    function addStyle(obj, options) {
    	var styleElement, update, remove;

    	if (options.singleton) {
    		var styleIndex = singletonCounter++;
    		styleElement = singletonElement || (singletonElement = createStyleElement(options));
    		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
    		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
    	} else if(obj.sourceMap &&
    		typeof URL === "function" &&
    		typeof URL.createObjectURL === "function" &&
    		typeof URL.revokeObjectURL === "function" &&
    		typeof Blob === "function" &&
    		typeof btoa === "function") {
    		styleElement = createLinkElement(options);
    		update = updateLink.bind(null, styleElement);
    		remove = function() {
    			removeStyleElement(styleElement);
    			if(styleElement.href)
    				URL.revokeObjectURL(styleElement.href);
    		};
    	} else {
    		styleElement = createStyleElement(options);
    		update = applyToTag.bind(null, styleElement);
    		remove = function() {
    			removeStyleElement(styleElement);
    		};
    	}

    	update(obj);

    	return function updateStyle(newObj) {
    		if(newObj) {
    			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
    				return;
    			update(obj = newObj);
    		} else {
    			remove();
    		}
    	};
    }

    var replaceText = (function () {
    	var textStore = [];

    	return function (index, replacement) {
    		textStore[index] = replacement;
    		return textStore.filter(Boolean).join('\n');
    	};
    })();

    function applyToSingletonTag(styleElement, index, remove, obj) {
    	var css = remove ? "" : obj.css;

    	if (styleElement.styleSheet) {
    		styleElement.styleSheet.cssText = replaceText(index, css);
    	} else {
    		var cssNode = document.createTextNode(css);
    		var childNodes = styleElement.childNodes;
    		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
    		if (childNodes.length) {
    			styleElement.insertBefore(cssNode, childNodes[index]);
    		} else {
    			styleElement.appendChild(cssNode);
    		}
    	}
    }

    function applyToTag(styleElement, obj) {
    	var css = obj.css;
    	var media = obj.media;

    	if(media) {
    		styleElement.setAttribute("media", media)
    	}

    	if(styleElement.styleSheet) {
    		styleElement.styleSheet.cssText = css;
    	} else {
    		while(styleElement.firstChild) {
    			styleElement.removeChild(styleElement.firstChild);
    		}
    		styleElement.appendChild(document.createTextNode(css));
    	}
    }

    function updateLink(linkElement, obj) {
    	var css = obj.css;
    	var sourceMap = obj.sourceMap;

    	if(sourceMap) {
    		// http://stackoverflow.com/a/26603875
    		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
    	}

    	var blob = new Blob([css], { type: "text/css" });

    	var oldSrc = linkElement.href;

    	linkElement.href = URL.createObjectURL(blob);

    	if(oldSrc)
    		URL.revokeObjectURL(oldSrc);
    }


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

    var isObject = __webpack_require__(6),
        now = __webpack_require__(7),
        toNumber = __webpack_require__(8);

    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max,
        nativeMin = Math.min;

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide an options object to indicate whether `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent calls
     * to the debounced function return the result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime = 0,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            result = wait - timeSinceLastCall;

        return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (!lastCallTime || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        clearTimeout(timerId);
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastCallTime = lastInvokeTime = 0;
        lastArgs = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    module.exports = debounce;


/***/ },
/* 6 */
/***/ function(module, exports) {

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    module.exports = isObject;


/***/ },
/* 7 */
/***/ function(module, exports) {

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @type {Function}
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred function to be invoked.
     */
    var now = Date.now;

    module.exports = now;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

    var isFunction = __webpack_require__(9),
        isObject = __webpack_require__(6),
        isSymbol = __webpack_require__(10);

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = isFunction(value.valueOf) ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    module.exports = toNumber;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

    var isObject = __webpack_require__(6);

    /** `Object#toString` result references. */
    var funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]';

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8 which returns 'object' for typed array and weak map constructors,
      // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    module.exports = isFunction;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

    var isObjectLike = __webpack_require__(11);

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    module.exports = isSymbol;


/***/ },
/* 11 */
/***/ function(module, exports) {

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    module.exports = isObjectLike;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

    
    //default ease from ease.js
    var ease = __webpack_require__(13);

    /**
     * Simple and easy RAF animation function
     *
     * Example:
     *
     *    animate({
     *        duration: 1.8,
     *        step: step,
     *        complete: function() {
     *           //stuff
     *        }
     *    });
     *
     *     function step(progress) {
     *        // `progress` ranges from 0 to 1 —- 0 start, 1 is done
     *     }
     *
     *
     * @param ani Object
     */
    function animate(params) {

        var duration = typeof params.duration == 'undefined' ? 0.3 : params.duration;
            duration *= 1000;
            end = +new Date() + duration;

        var request;

        var step = function() {

            var current = +new Date(),
                remaining = end - current;

            var rate = clamp(1 - remaining / duration, 0, 1);
            rate = params.ease ? params.ease(rate) : ease(rate);

            if (params.step)
                params.step(rate);

            if (remaining <= 0) {
                if (params.complete) {
                    params.complete();
                    //request = requestAnimationFrame(params.complete);
                    return;
                }
            }

            request = requestAnimationFrame(step);
        };

        if(duration === 0)
            step();
        else
            request = requestAnimationFrame(step);

        return {
            cancel: function() {
                cancelAnimationFrame(request);
            }
        };

    }

    function clamp(n, min, max) {
      return Math.min(Math.max(n, min), max);
    }


    module.exports = animate;


/***/ },
/* 13 */
/***/ function(module, exports) {

    function qinticInOut(t) {
        if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t * t * t
        return 0.5 * ( ( t -= 2 ) * t * t * t * t + 2 )
    }

    module.exports = qinticInOut

/***/ },
/* 14 */
/***/ function(module, exports) {

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    module.exports = isUndefined;


/***/ },
/* 15 */
/***/ function(module, exports) {

    module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ractive-datepicker ",{"t":2,"r":"class"}],"style":[{"t":2,"r":"style"}]},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["year",{"t":4,"f":[" active"],"n":50,"x":{"r":["editing"],"s":"_0==\"year\""}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"editing\",\"year\"]"}}},"f":[{"t":2,"r":"year"}]}," ",{"t":7,"e":"div","a":{"class":["date",{"t":4,"f":[" active"],"n":50,"x":{"r":["editing"],"s":"_0==\"date\""}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"editing\",\"date\"]"}}},"f":[{"t":7,"e":"span","a":{"class":"weekday"},"f":[{"t":2,"r":"weekday"},","]}," ",{"t":7,"e":"div","f":[{"t":2,"r":"month"}," ",{"t":2,"x":{"r":["date"],"s":"_0.getDate()"}}]}]}],"n":50,"x":{"r":["mode"],"s":"_0==\"date\"||_0==\"datetime\""}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":["time",{"t":4,"f":[" active"],"n":50,"x":{"r":["editing"],"s":"_0==\"time\""}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"editing\",\"time\"]"}}},"f":[{"t":2,"r":"time"}]}],"n":50,"x":{"r":["mode"],"s":"_0==\"time\"||_0==\"datetime\""}}]}," ",{"t":7,"e":"div","a":{"class":"editor"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"nav"},"f":[{"t":7,"e":"div","a":{"class":"next up"},"v":{"click":"decrementYear"}}]}," ",{"t":7,"e":"div","a":{"class":"years"},"v":{"wheel-touchmove":{"n":"clockwheel","a":"setYear"}},"o":"preventOverscroll","f":[{"t":4,"f":[{"t":7,"e":"div","m":[{"t":4,"f":["class='active'"],"n":50,"x":{"r":[".","year"],"s":"_0==_1"}}],"v":{"click":"setYear"},"f":[{"t":2,"r":"."}]}],"r":"years"}]}," ",{"t":7,"e":"div","a":{"class":"nav"},"f":[{"t":7,"e":"div","a":{"class":"previous down"},"v":{"click":"incrementYear"}}]}],"n":50,"x":{"r":["editing"],"s":"_0==\"year\""}},{"t":4,"n":51,"f":[{"t":4,"n":50,"x":{"r":["editing"],"s":"_0==\"date\""},"f":[{"t":7,"e":"div","a":{"class":"nav"},"f":[{"t":7,"e":"div","a":{"class":"previous"},"v":{"click":"decrementMonth"}}," ",{"t":7,"e":"div","a":{"class":"next"},"v":{"click":"incrementMonth"}}]}," ",{"t":7,"e":"div","a":{"class":"monthyear"},"f":[{"t":2,"r":"currentMonth"}," ",{"t":7,"e":"span","v":{"click":{"m":"set","a":{"r":[],"s":"[\"editing\",\"year\"]"}}},"f":[{"t":2,"r":"currentYear"}]}]}," ",{"t":7,"e":"div","a":{"class":"days"},"f":[{"t":7,"e":"div","a":{"class":"weekdays"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":[{"t":2,"r":"."}]}],"r":"daysOfWeek"}]}," ",{"t":7,"e":"div","a":{"class":"dates"},"f":[{"t":4,"f":[{"t":7,"e":"div","m":[{"t":4,"f":["class='active'"],"n":50,"x":{"r":["current.year","current.month","date","."],"s":"_2 instanceof Date&&_2.getFullYear()==_0&&_2.getMonth()==_1&&_2.getDate()==_3"}}],"v":{"click":"setDate"},"f":[{"t":2,"r":"."}]}],"r":"dates"}]}]}]},{"t":4,"n":50,"x":{"r":["editing"],"s":"(!(_0==\"date\"))&&(_0==\"time\")"},"f":[" ",{"t":7,"e":"div","a":{"class":"clock"},"f":[{"t":7,"e":"div","a":{"class":"hours"},"v":{"wheel-touchmove":{"n":"clockwheel","a":"setHours"}},"o":"preventOverscroll","f":[{"t":4,"f":[{"t":7,"e":"div","f":[{"t":2,"r":"."}]}],"r":"hours"}]}," ",{"t":7,"e":"span","a":{"class":"colon"},"f":[":"]}," ",{"t":7,"e":"div","a":{"class":"minutes"},"v":{"wheel-touchmove":{"n":"clockwheel","a":"setMinutes"}},"o":"preventOverscroll","f":[{"t":4,"f":[{"t":7,"e":"div","f":[{"t":2,"x":{"r":["."],"s":"_0<10?\"0\"+_0:_0"}}]}],"r":"minutes"}]}," ",{"t":7,"e":"div","a":{"class":"meridiem"},"f":[{"t":7,"e":"span","a":{"class":["am ",{"t":4,"f":["selected"],"n":50,"x":{"r":["meridiem"],"s":"_0==\"am\""}}]},"v":{"click":{"n":"setMeridiem","a":"am"}},"f":["AM"]}," ",{"t":7,"e":"span","a":{"class":["pm ",{"t":4,"f":["selected"],"n":50,"x":{"r":["meridiem"],"s":"_0==\"pm\""}}]},"v":{"click":{"n":"setMeridiem","a":"pm"}},"f":["PM"]}]}]}]}],"x":{"r":["editing"],"s":"_0==\"year\""}}]}]}]};

/***/ },
/* 16 */
/***/ function(module, exports) {

    
    var win = window;
    var doc = document;

    module.exports = function(node, instance) {

        node.addEventListener('mouseenter', disableScroll);
        node.addEventListener('mouseleave', enableScroll);

        var contentHeight;

        function preventDefault(e) {

            e = e || win.event;
            if( (node.scrollTop <= 1 && e.deltaY < 0) ||
               (node.scrollTop >= contentHeight && e.deltaY > 0) ) {

                if (e.preventDefault)
                    e.preventDefault();
                e.returnValue = false;
                return false;
            }
        }

        function disableScroll() {
            // cache height for perf and avoiding reflow/repaint
            contentHeight = node.scrollHeight - node.offsetHeight - 1;

            win.addEventListener('DOMMouseScroll', preventDefault, false);
            win.addEventListener('wheel', preventDefault); // modern standard
            win.addEventListener('mousewheel', preventDefault); // older browsers, IE
            doc.addEventListener('mousewheel', preventDefault);
            win.addEventListener('touchmove', preventDefault); // mobile
        }

        function enableScroll() {

            win.removeEventListener('DOMMouseScroll', preventDefault, false);

            win.removeEventListener('wheel', preventDefault); // modern standard
            win.removeEventListener('mousewheel', preventDefault); // older browsers, IE
            doc.removeEventListener('mousewheel', preventDefault);
            win.removeEventListener('touchmove', preventDefault); // mobile
        }

        return {
            teardown: function() {
                node.removeEventListener('mouseenter', disableScroll);
                node.removeEventListener('mouseleave', enableScroll);
            }
        }


    }


/***/ }
/******/ ])
});
;