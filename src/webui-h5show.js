/*
 * 
 * 
 *
 * Copyright (c) 2015 Sandy Duan
 * Licensed under the MIT license.
 */
(function (document, window ) {
	'use strict';
    

    // HELPER FUNCTIONS 
    //Most helper functions is heavily inspired by impress.js http://bartaz.github.io/impress.js
    
    // `pfx` is a function that takes a standard CSS property name as a parameter
    // and returns it's prefixed version valid for current browser it runs in.
    // The code is heavily inspired by Modernizr http://www.modernizr.com/
    var pfx = (function () {
        
        var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};
        
        return function ( prop ) {
            if ( typeof memory[ prop ] === "undefined" ) {
                
                var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
                
                memory[ prop ] = null;
                for ( var i in props ) {
                    if ( style[ props[i] ] !== undefined ) {
                        memory[ prop ] = props[i];
                        break;
                    }
                }
            
            }
            
            return memory[ prop ];
        };
    
    })();
    
    // `arraify` takes an array-like object and turns it into real Array
    // to make all the Array.prototype goodness available.
    var arrayify = function ( a ) {
        return [].slice.call( a );
    };
    
    // `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
    var css = function ( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = pfx(key);
                if ( pkey !== null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };
    
    // `toNumber` takes a value given as `numeric` parameter and tries to turn
    // it into a number. If it is not possible it returns 0 (or other value
    // given as `fallback`).
    var toNumber = function (numeric, fallback) {
        return isNaN(numeric) ? (fallback || 0) : Number(numeric);
    };
    
    // `byId` returns element with given `id` - you probably have guessed that ;)
    var byId = function ( id ) {
        return document.getElementById(id);
    };
    
    // `$` returns first element for given CSS `selector` in the `context` of
    // the given element or whole document.
    var $ = function ( selector, context ) {
        context = context || document;
        return context.querySelector(selector);
    };
    
    // `$$` return an array of elements for given CSS `selector` in the `context` of
    // the given element or whole document.
    var $$ = function ( selector, context ) {
        context = context || document;
        return arrayify( context.querySelectorAll(selector) );
    };
    
    // `triggerEvent` builds a custom DOM event with given `eventName` and `detail` data
    // and triggers it on element given as `el`.
    var triggerEvent = function (el, eventName, detail) {
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, true, detail);
        el.dispatchEvent(event);
    };




    var isPlainObject = function( obj ) {

		if ( typeof obj  !== "object"  ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	};

    var extend = function() {
    	var src, copyIsArray, copy, name, options, clone,
    		target = arguments[0] || {},
    		i = 1,
    		length = arguments.length,
    		deep = true;

    	// Handle a deep copy situation
    	if ( typeof target === "boolean" ) {
    		deep = target;
    		// skip the boolean and the target
    		target = arguments[ i ] || {};
    		i++;
    	}

    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== "object" && !typeof obj === "function" ) {
    		target = {};
    	}

    	// extend jQuery itself if only one argument is passed
    	if ( i === length ) {
    		target = this;
    		i--;
    	}

    	for ( ; i < length; i++ ) {
    		// Only deal with non-null/undefined values
    		if ( (options = arguments[ i ]) != null ) {
    			// Extend the base object
    			for ( name in options ) {
    				src = target[ name ];
    				copy = options[ name ];

    				// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						//console.log('abc');
						target[ name ] = extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
    			}
    		}
    	}

    	// Return the modified object
    	return target;
    };




    var defaults = {
    	index:0,
    	direction:'upDown',
    	indicator:false,
    	arrow:false,
    	page:{
    		show:'show',
    		hide:'hide',
    		stay:10
		},
		sprite:{
			show:'show',
			hide:null,
			showing:null
		}
    };


    function H5Show(elId,options){
    	this.container = byId( elId );
    	this.config = extend(defaults,options);
    	this.pages = arrayify( $$('.page'),this.container);
    	
    	this.init();
    }

    H5Show.prototype = {

    	init:function(){

    		for(var i in this.pages){
    			this.initPage(i);
    		}
    		this.showPage();
    	},

    	initPage:function(idx){
    		
    	},

    	setPageIndex:function(idx){
    		this.index = idx;
    		this.showPage();
    	},

    	getPage:function(idx){
    		return idx>=0&&idx<this.pages.length?this.pages[idx]:this.pages[0];
    	}

    	showPage:function(){
    		var page = getPage(this.index);
    		// if (page){
    		// 	page.classList.add('show');
    		// }
    	},

    	nextPage:function(){

    	},
    	prevPage:function(){

    	}


    };


    window.H5Show = H5Show;

}(document, window));
