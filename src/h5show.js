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
            if ( typeof memory[ prop ] === 'undefined' ) {
                
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
    
    
    // `$$` return an array of elements for given CSS `selector` in the `context` of
    // the given element or whole document.
    var $$ = function ( selector, context ) {
        context = context || document;
        return arrayify( context.querySelectorAll(selector) );
    };
    
    // `triggerEvent` builds a custom DOM event with given `eventName` and `detail` data
    // and triggers it on element given as `el`.
    var triggerEvent = function (el, eventName, detail) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, detail);
        el.dispatchEvent(event);
    };

    //Get element  from url hash
    var getIdFromHash = function(){
        return window.location.hash.replace(/^#\/?/,'');
    };

    var changeClass = function(action){
        return function(){
            var length = arguments.length;
            if (length>=2){
                var classes = Array.prototype.slice.call(arguments, 1);
                var clist = arguments[0].classList;
                if (clist){
                    for(var i in classes){
                        clist[action](classes[i]);
                    }
                }
            }
        };
    };

    var addClass = changeClass('add');
    var removeClass = changeClass('remove');



    //if object is plain object
    var isPlainObject = function( obj ) {

		if ( typeof obj  !== 'object'  ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwnProperty.call( obj.constructor.prototype, 'isPrototypeOf' ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	};

    // this method source code is from jquery 2.0.x
    // merge object's value and return
    var extend = function() {
    	var src, copyIsArray, copy, name, options, clone,
    		target = arguments[0] || {},
    		i = 1,
    		length = arguments.length,
    		deep = true;

    	// Handle a deep copy situation
    	if ( typeof target === 'boolean' ) {
    		deep = target;
    		// skip the boolean and the target
    		target = arguments[ i ] || {};
    		i++;
    	}

    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== 'object' && typeof obj !== 'function' ) {
    		target = {};
    	}


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





    //Delay by second
    var delay = function(handle,second,callback){
        if (handle){
            window.clearTimeout(handle);    
        }
        handle = window.setTimeout(callback,second*1000);
    };


    //Proxy of console.warn
    var warn = function(msg){
        if (window.console){
            window.console.warn(msg);
        }
    };

    //Proxy of console.log
    // var log = function(msg){
    //     if (window.console){
    //         window.console.log(msg);
    //     }
    // };

    //====================== private var and func ======================//


    var _defaultPageDuration = 1.5;
    var _defaultDuration = 1;

    


    // Parse dataset of element, then layout by css
    var _layoutElement = function(el){
        
        //Convert to css size value
        var cssSize = function(v){
                if (v.indexOf('%')===-1&&v.indexOf('px')===-1){
                    v+='px';
                }
            return v;
        };

        //Is position set to  center 
        var isCenter = function(v){
            return v==='center'||v==='middle';
        };

        //Get x position
        var getXPos = function(v,styles){
             var x = cssSize(v);

             if (x.indexOf('-')===-1){
                styles.left=x;
             }else{
                styles.right=x.substr(1);  
             }
        };

        //Get y position
        var getYPos = function(v,styles){
             var y = cssSize(v);
             if (y.indexOf('-')===-1){
                styles.top=y;
             }else{
                styles.bottom=y.substr(1); 
             }   
        };

        var ds = el.dataset;
        var styles = {};

        //Caulate the size info

        //Is position set to  center 
        var isAutoSize = function(v){
            return v==='auto';
        };

        if (ds.fontsize){
            var fsize = cssSize(ds.fontsize);
            if (fsize.indexOf('%')>=0){
                fsize = fsize.replace('%','vw');
            }
            styles.fontSize = fsize;
        }

        
        if (ds.size){
           var sizes = ds.size.split(',');
           if (sizes.length===1){sizes.push(sizes[0]);}

           if (sizes.length){
                
                if (!isAutoSize(sizes[0])){
                    styles.width = cssSize(sizes[0]);
                }
                if (!isAutoSize(sizes[1])){
                    styles.height = cssSize(sizes[1]);
                }
           }

        }

        //Caculate the position info
        if (ds.pos){
            styles.position='absolute';
            var pos = ds.pos.split(',');
            if (pos.length===1){pos.push(pos[0]);}
            if (pos.length){
                var xc = isCenter(pos[0]);
                var yc = isCenter(pos[1]);
                if (xc){
                    //styles.left = '50%';
                    styles.marginLeft = 'auto';
                    styles.marginRight = 'auto';
                    styles.textAlign = 'center';

                    if (yc){
                        //The transform is conflict with animate css use transform property , result in top offset .
                        //I can't find any perfect solution to fix it;
                        styles.top = '50%';
                        styles.transform = 'translateY(-50%)';
                    }else{
                        getYPos(pos[1],styles);
                    }

                }else{
                    getXPos(pos[0],styles);

                    if (yc){
                        styles.top = '50%';
                        styles.transform = 'translateY(-50%)';
                    }else{
                        getYPos(pos[1],styles);
                    }

                }
                
            } 
        } 
        
        
        if (ds.time){
            el.classList.add('hide');
        }


        css(el,styles);
    }; //End of _layoutElement


    //Set animation duration of the element
    var setDuration =function(el,duration,def){
        if (duration!==def){
            css(el,{
                animationDuration: duration+'s',
                animationFillMode:'both'
            });
        }
    };

    //Animate the element if dataset has time property
    var _animateElement = function(el,defDuration){
        var ds = el.dataset;
        var cfg = el.config;
        var styles = {};

        if (ds.time){
            setDuration(el,cfg.duration,_defaultDuration);
            window.setTimeout(function(){
                removeClass(el,'hide');
                addClass(el,'animated',cfg.show);
                //$item.removeClass('hide animated').addClass('animated ' + $item.data('in'));
            }, ds.time*1000);
            
        }
    };


    var _defaults = {
    	index:0,
        autoPlay:false,
    	direction:'upDown',
    	indicator:false,
    	arrow:false,
    	page:{
    		show:'fadeInUp',
    		hide:'fadeOutDown',
    		stay:3,
            duration:1.5
		},
		sprite:{
			show:'fadeIn',
			hide:'fadeOut',
			showing:null,
            duration:1
		}
    };

    

    var _sPage = '.page'; //page selector
    var _cPageContainer = 'page-container'; //page container class name
    var _cAnimated = 'animated'; //animated class name
    var _cPageActive = 'page-active'; //active page class name


    var hidePageTimeout = null; //timeout that hide page after animate
    var autoPlayTimeout = null; //timeout that auto play to next page


    
    var lastHash = '';  // last hash detected




    //Construct method, set container by element Id, extend options and set value to config
    function H5Show(elId,options){
    	this.container = byId( elId );
        this.config = extend({},_defaults,options);
    	this.initEventListeners();
        this.init();
    }

    H5Show.prototype = {

        //Initialize pages,pageCount,lastIdx, showPage by index of config
    	init:function(){
            //pageMap is help object to find page by id, maybe faster than document.getElementById
            this.pageMap = {};
            //sprites is object to keep all sprites, by page id;
            this.sprites = {};
            this.pages = arrayify( $$(_sPage),this.container);
            this.pageCount = this.pages.length;
            this.container.classList.add(_cPageContainer);
    		
            for(var i=0;i<this.pages.length;i++){
                var page = this.pages[i];
                page.inited = false;
                page.idx = i;
                //If page id is not setted, create one;
                if (!page.id) {
                    page.id = 'page' + (page.idx+1);
                }
                this.pageMap[page.id] = page;
    	    }
            this.lastIdx = -1;
            this.idx = this.idxFromHash()||this.config.index;
    		this.goto(this.getPage(this.idx));
    	},

        //Initialize page classes ,config and elements in page;
    	initPage:function(page){

            var cfg = page.config = extend({},this.config.page,page.dataset);
            //Make sure stay,duration is number
            cfg.stay = toNumber(cfg.stay);
            cfg.duration = toNumber(cfg.duration);
            setDuration(page,cfg.duration,_defaultPageDuration);

            this.initSprites(page);

    		page.inited = true;
    	},
        //Initialize all elements in page as sprites
        initSprites:function(page){
            var sprites = page.querySelectorAll('*');
            this.sprites[page.id] = sprites;
            for(var i= 0 ;i<sprites.length;i++){
                var sprite = sprites[i];
                var cfg = sprite.config = extend({},this.config.sprite,sprite.dataset);
                cfg.duration = toNumber(cfg.duration);
                _layoutElement(sprite);
                _animateElement(sprite);
            }
        },

        //Initialize default event listeners
        initEventListeners:function(){
            var that = this;
            window.addEventListener('hashchange', function () {
                    that.setIdx( that.idxFromHash());
            }, false);

            this.container.addEventListener('h5show.pageEnter', function (e) {
                var newHash = '#/' + e.target.id;
                //If the hash is changed, uses hashchange event handler to process, otherwise set page index
                if (window.location.hash!==newHash){
                    window.location.hash = lastHash = newHash;
                }else{
                    that.setIdx(e.target.idx);
                }
            }, false);
        },
        //Go to page by id
        goto:function(page){
            if (page){
                triggerEvent(page, 'h5show.pageEnter');
            }
        },
        //Get page index from hash
        idxFromHash:function(){
            var page = this.pageMap[getIdFromHash()];
            return page?page.idx:0;
        },

        //Get page element by index specified, if idx argument is not passed, index is set to this.idx
    	getPage:function(idx){
            if (idx===undefined){
                idx = this.idx;
            }
    		var page =  idx>=0&&idx<this.pageCount?this.pages[idx]:this.pages[0];
            if (!page.inited){
                this.initPage(page);
            }
            return page;
    	},

        //Set page index, hide last page if exists ,then show page
        setIdx:function(idx){
            if (idx<0||idx>this.pageCount-1){
                warn('idx:' + idx + ' is not valid !');
                return;
            }
            this.idx = idx;
            if (this.lastIdx>=0){
                this.hidePage(this.lastIdx);
            }
            this.showPage(idx);
        },
        //Hide page by index
        hidePage:function(idx){
            var page = this.getPage(idx);
            if (page){
                var cfg = page.config;
                removeClass(page,cfg.show);
                addClass(page,cfg.hide);
                
                delay(hidePageTimeout,cfg.duration,function(){
                    removeClass(page,_cPageActive,_cAnimated,cfg.hide);
                });
            }
        },

        //Show page by index
    	showPage:function(idx){
            var page = this.getPage(idx);
            page.classList.add(_cAnimated,_cPageActive,page.config.show);
            this.lastIdx = page.idx;
            //If autoPlay is true, show next page after stay time
            if (this.config.autoPlay){
                var that = this;
                delay(autoPlayTimeout,page.config.duration+ page.config.stay,function(){
                    that.nextPage();
                });
            }

    	},

        //Show next page
    	nextPage:function(){
            var idx = this.idx<this.pageCount-1?this.idx+1:0;
            this.goto(this.getPage(idx));
    	},
        //Show previous page
    	prevPage:function(){
             if (this.idx>0){
                this.goto(this.getPage(this.idx-1));
             }
    	}
        
        //Events 
        
    };



    window.H5Show = H5Show;

}(document, window));
