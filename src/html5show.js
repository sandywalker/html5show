/*
 *
 *
 *
 * Copyright (c) 2015 Sandy Duan
 * Licensed under the MIT license.
 */
(function(document, window) {
    'use strict';


    // HELPER FUNCTIONS
    //Most helper functions is heavily inspired by impress.js http://bartaz.github.io/impress.js

    // `pfx` is a function that takes a standard CSS property name as a parameter
    // and returns it's prefixed version valid for current browser it runs in.
    // The code is heavily inspired by Modernizr http://www.modernizr.com/
    var pfx = (function() {

        var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};

        return function(prop) {
            if (typeof memory[prop] === 'undefined') {

                var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

                memory[prop] = null;
                for (var i in props) {
                    if (style[props[i]] !== undefined) {
                        memory[prop] = props[i];
                        break;
                    }
                }

            }

            return memory[prop];
        };

    })();

    // `arraify` takes an array-like object and turns it into real Array
    // to make all the Array.prototype goodness available.
    var arrayify = function(a) {
        return [].slice.call(a);
    };

    // `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
    var css = function(el, props) {
        var key, pkey;
        for (key in props) {
            if (props.hasOwnProperty(key)) {
                pkey = pfx(key);
                if (pkey !== null) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };

    // `toNumber` takes a value given as `numeric` parameter and tries to turn
    // it into a number. If it is not possible it returns 0 (or other value
    // given as `fallback`).
    var toNumber = function(numeric, fallback) {
        return isNaN(numeric) ? (fallback || 0) : Number(numeric);
    };

    // convert string value to bool, if str is null, return def;
    var toBool = function(str, def) {
        var _def = def || false;
        if (str == null) {
            return _def;
        }
        return str === "true" || str === true ? true : false;
    };

    // `byId` returns element with given `id` - you probably have guessed that ;)
    var byId = function(id) {
        return document.getElementById(id);
    };


    // `$$` return an array of elements for given CSS `selector` in the `context` of
    // the given element or whole document.
    var $$ = function(selector, context) {
        context = context || document;
        return arrayify(context.querySelectorAll(selector));
    };

    // `triggerEvent` builds a custom DOM event with given `eventName` and `detail` data
    // and triggers it on element given as `el`.
    var triggerEvent = function(el, eventName, detail) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, detail);
        el.dispatchEvent(event);
    };

    //Get element  from url hash
    var getIdFromHash = function() {
        return window.location.hash.replace(/^#\/?/, '');
    };

    var changeClass = function(action) {
        return function() {
            var length = arguments.length;
            if (length >= 2) {
                var classes = Array.prototype.slice.call(arguments, 1);
                var clist = arguments[0].classList;
                if (clist) {
                    for (var i in classes) {
                        clist[action](classes[i]);
                    }
                }
            }
        };
    };

    var addClass = changeClass('add');
    var removeClass = changeClass('remove');



    //if object is plain object
    var isPlainObject = function(obj) {

        if (typeof obj !== 'object') {
            return false;
        }

        if (obj.constructor &&
            !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
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
        if (typeof target === 'boolean') {
            deep = target;
            // skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && typeof obj !== 'function') {
            target = {};
        }


        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];

                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        //console.log('abc');

                        target[name] = extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };





    //Delay by second
    var delay = function(handle, second, callback) {
        if (handle) {
            window.clearTimeout(handle);
        }
        return window.setTimeout(callback, second * 1000);
    };


    //Proxy of console.warn
    var warn = function(msg) {
        if (window.console) {
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
    var _layoutElement = function(el) {



        var ds = el.dataset;
        var styles = {};
        var sizes = [];
        var origins = [];



        //Convert to css size value
        var cssSize = function(v) {
            if (v.indexOf('%') === -1 && v.indexOf('px') === -1) {
                v += 'px';
            }
            return v;
        };








        /* Get x position
           v:  position x value,
           styles: css styles of the element,
           origin: origins
        */
        var getXPos = function(v, styles) {
            var x = cssSize(v);
            var flag = -1;
            if (x.indexOf('-') === -1) {
                styles.left = x;
            } else {
                styles.right = x.substr(1);
                flag = 1;
            }
            if (origins && sizes) {
                styles.marginLeft = calcMarginFix(sizes[0], origins[0], flag);
            }
        };


        /* Get y position
           v:  position y value,
           styles: css styles of the element,
           origins: origins
        */
        var getYPos = function(v, styles) {
            var y = cssSize(v);
            var flag = -1;
            if (y.indexOf('-') === -1) {
                styles.top = y;
            } else {
                styles.bottom = y.substr(1);
                flag = 1;
            }
            if (origins && sizes) {
                styles.marginTop = calcMarginFix(sizes[1], origins[1], flag);
            }
        };



        /*
            calcMarginFix by origin
            sz: width or height,
            origin: origin
            flag: determine margin is positive or negative,value can be 1 or -1,default value = -1
        */
        var calcMarginFix = function(sz, origin, flag) {
            if (!sz) {
                return 0;
            }

            var fg = flag || -1;
            var suffix = sz.indexOf('%') >= 0 ? '%' : 'px';
            var margin = 0;
            var intSize = fg * parseInt(sz);
            if (origin === 'center') {
                margin = intSize / 2;
            } else if (origin === 'right' || origin === 'bottom') {
                margin = intSize;
            }
            return cssSize(margin + suffix);
        };

        //Caulate the size info

        //Is position set to  center
        var isAutoSize = function(v) {
            return v === 'auto';
        };



        if (ds.fontsize) {
            var fsize = cssSize(ds.fontsize);
            if (fsize.indexOf('%') >= 0) {
                fsize = fsize.replace('%', 'vw');
            }
            styles.fontSize = fsize;
        }


        if (ds.size) {
            sizes = ds.size.split(',');
            if (sizes.length === 1) {
                sizes.push(sizes[0]);
            }

            if (sizes.length) {

                if (!isAutoSize(sizes[0])) {
                    styles.width = cssSize(sizes[0]);
                }
                if (!isAutoSize(sizes[1])) {
                    styles.height = cssSize(sizes[1]);
                }
            }

        } else {
            styles.width = '100%';
        }

        if (ds.origin) {
            origins = ds.origin.split(',');
            if (origins.length === 1) {
                origins.push(origins[0]);
            }
        }


        //Caculate the position info
        if (ds.pos) {
            styles.position = 'absolute';
            var pos = ds.pos.split(',');
            if (pos.length === 1) {
                pos.push(pos[0]);
            }
            if (pos.length) {
                getXPos(pos[0], styles);
                getYPos(pos[1], styles);
            }
        }


        if (ds.time) {
            el.classList.add('hide');
        }

        if (ds.bg) {
            styles.background = ds.bg.indexOf('#') === -1 ? 'url(' + ds.bg + ') center center no-repeat' : ds.bg;
        }

        if (ds.color) {
            styles.color = ds.color;
        }

        if (ds.opacity) {
            styles.opacity = ds.opacity;
        }

        css(el, styles);
    }; //End of _layoutElement






    //Set animation duration of the element
    var setDuration = function(el, duration, def) {
        if (duration !== def) {
            css(el, {
                animationDuration: duration + 's',
                animationFillMode: 'both'
            });
        }
    };


    var removeSpriteHandler = function(spriteHandlers, handler) {
        var idx = spriteHandlers.indexOf(handler);
        if (idx >= 0) {
            spriteHandlers.shift(idx);
        }
    };

    var clearSpriteHandlers = function(spriteHandlers) {
        for (var h in spriteHandlers) {
            window.clearTimeout(spriteHandlers[h]);
        }
        spriteHandlers.length = 0;
    };
    //Animate the element if dataset has time property
    var _animateElement = function(el, spriteHandlers) {
        var ds = el.dataset;
        var cfg = el.config;

        if (!cfg.duration) {
            cfg.duration = _defaultDuration;
        }
        if (ds.time) {
            //Must change ds.time to Number
            var time = toNumber(ds.time);

            setDuration(el, cfg.duration, _defaultDuration);

            // Set Show animation
            var showH = window.setTimeout(function() {
                removeClass(el, 'hide');
                addClass(el, 'animated', cfg.show);
                removeSpriteHandler(spriteHandlers, showH);
            }, time * 1000);
            spriteHandlers.push(showH);
            // Set Showing animation if user specify;
            if (ds.showing) {

                var showingH = window.setTimeout(function() {
                    removeClass(el, cfg.show);
                    addClass(el, cfg.showing);
                    removeSpriteHandler(spriteHandlers, showingH);
                }, (time + cfg.duration) * 1000);
                spriteHandlers.push(showingH);
            }

            if (ds.stay) {
                var stay = toNumber(ds.stay);
                var hideH = window.setTimeout(function() {

                    removeClass(el, cfg.show, cfg.showing);

                    if (el.classList.contains('hiding')) {
                        addClass(el, cfg.hide);
                    } else {
                        var hide = cfg.hide || 'hide';
                        addClass(el, hide);
                    }

                    removeSpriteHandler(spriteHandlers, hideH);
                }, (time + cfg.duration + stay) * 1000);
                spriteHandlers.push(hideH);
            }
        }
    };

    //Hide the element
    var _hideElement = function(el) {
        var cfg = el.config;
        removeClass(el, cfg.showing, cfg.show, cfg.hide);
        if (cfg.time) {
            addClass(el, 'hide');
        }
        addClass(el, 'hiding');
    };

    //Reset the element
    var _resetElement = function(el) {
        var cfg = el.config;
        removeClass(el, cfg.showing, cfg.show, cfg.hide);
        if (cfg.time) {
            addClass(el, 'hide');
        }
    };


    var _defaults = {
        play: false,
        direction: 'horizontal',
        indicator: true,
        arrow: false,
        index: 0,
        urlHash: false,
        page: {
            show: null,
            hide: null,
            duration: 1.5
        },
        sprite: {
            show: 'fadeIn',
            hide: 'fadeOut',
            showing: null,
            duration: 1
        }
    };



    var _sPage = '.page'; //page selector
    var _cPageContainer = 'page-container'; //page container class name
    var _cAnimated = 'animated'; //animated class name
    var _cPageActive = 'page-active'; //active page class name






    var _cPageAni = {
        toL: 'pg-moveToLeft',
        toR: 'pg-moveToRight',
        fromL: 'pg-moveFromLeft',
        fromR: 'pg-moveFromRight',
        toT: 'pg-moveToTop',
        toB: 'pg-moveToBottom',
        fromT: 'pg-moveFromTop',
        fromB: 'pg-moveFromBottom'
    };

    var lastHash = ''; // last hash detected





    //Construct method, set container by element Id, extend options and set value to config
    function html5show(elId, options) {
        this.container = byId(elId);
        this.config = extend({}, _defaults, options, this.container.dataset);
        this.initEventListeners();
        this.init();
    }

    html5show.prototype = {

        //Initialize pages,pageCount,lastIdx, showPage by index of config
        init: function() {
            //pageMap is help object to find page by id, maybe faster than document.getElementById
            this.pageMap = {};
            //sprites is object to keep all sprites, by page id;
            this.sprites = {};
            //timeout handlers of the sprites
            this.spritesHandlers = [];
            //handler that hide page after animate
            this.hidePageHandler = null;
            //handler that auto play to next page
            this.playHandler = null;
            this.pages = $$(_sPage, this.container);
            this.pageCount = this.pages.length;
            this.container.classList.add(_cPageContainer);

            this.config.indicator = toBool(this.config.indicator);
            this.config.arrow = toBool(this.config.arrow);
            this.config.play = toBool(this.config.play);

            if (this.pages.length === 0) {
                return;
            }
            if (this.config.indicator) {
                this.initIndicator();
            }
            if (this.config.arrow) {
                this.initArrow();
            }


            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                page.inited = false;
                page.idx = i;
                //If page id is not setted, create one;
                if (!page.id) {
                    page.id = this.container.id + 'page' + (page.idx + 1);
                }
                this.pageMap[page.id] = page;
            }
            this.lastIdx = -1;
            this.idx = this.idxFromHash() || this.config.index;

            this.goto(this.getPage(this.idx));
        },
        //Initialize indicator and set position,fix the position when it is set to left or right
        initIndicator: function() {

            var ul = document.createElement("ul");
            var ind = this.config.indicator;

            if (ind === 'true' || ind === true) {
                ind = this.config.direction === 'horizontal' ? 'bottom' : 'right';
            }
            addClass(ul, 'indicator', 'indicator-' + ind);
            for (var i = 0; i < this.pages.length; i++) {
                var li = document.createElement('li');
                li.dataset.page = i;
                li.dataset.flag = 'indicator';
                ul.appendChild(li);
            }
            this.container.appendChild(ul);

            //fix the left/right position
            if ('left' === ind || 'right' === ind) {
                ul.style.top = ul.offsetTop - ul.clientHeight / 2 + 'px';
            }
            this.indicator = ul;


        },
        initArrow: function() {
            var isHor = this.config.direction === 'horizontal';
            var that = this;
            var _createArrow = function(direction, isHor) {
                var arr = document.createElement("div");
                var dir = '';
                if (direction === 'prev') {
                    dir = isHor ? 'left' : 'top';
                } else if (direction === 'next') {
                    dir = isHor ? 'right' : 'bottom';
                }
                addClass(arr, 'arrow', 'arrow-' + dir);

                var inner = document.createElement('div');
                inner.dataset.flag = 'arrow';
                inner.dataset.direction = direction;
                addClass(inner, 'arrow-inner');

                arr.dataset.flag = 'arrow';
                arr.dataset.direction = direction;

                arr.appendChild(inner);
                that.container.appendChild(arr);
                return arr;
            };
            this.arrowPrev = _createArrow('prev', isHor);
            this.arrowNext = _createArrow('next', isHor);
        },

        //Initialize page classes ,config and elements in page;
        initPage: function(page) {

            var cfg = page.config = extend({}, this.config.page, page.dataset);
            //Make sure stay,duration is number
            cfg.stay = toNumber(cfg.stay);
            cfg.duration = toNumber(cfg.duration);

            cfg.arrow = toBool(cfg.arrow, true);
            cfg.indicator = toBool(cfg.indicator, true);

            setDuration(page, cfg.duration, _defaultPageDuration);
            var styles = {};
            if (cfg.bg) {
                styles.background = cfg.bg.indexOf('#') === -1 ? 'url(' + cfg.bg + ') center center no-repeat' : cfg.bg;
            }
            css(page, styles);
            this.initSprites(page);

            page.inited = true;

        },
        //Initialize all elements in page as sprites
        initSprites: function(page) {
            var sprites = page.querySelectorAll('*');
            if (!sprites) {
                return;
            }
            this.sprites[page.id] = sprites;
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                var cfg = sprite.config = extend({}, this.config.sprite, sprite.dataset);
                cfg.duration = toNumber(cfg.duration);
                _layoutElement(sprite);
            }
        },

        //Initialize default event listeners
        initEventListeners: function() {
            var that = this;
            if (that.config.urlHash) {
                window.addEventListener('hashchange', function() {
                    that.setIdx(that.idxFromHash());
                }, false);

                that.container.addEventListener('html5show.pageEnter', function(e) {
                    var newHash = '#/' + e.target.id;
                    //If the hash is changed, uses hashchange event handler to process, otherwise set page index.
                    if (window.location.hash !== newHash) {
                        window.location.hash = lastHash = newHash;
                    } else {
                        that.setIdx(e.target.idx);
                    }
                }, false);
            }


            //Init the click event handler for indicators and arrows.
            that.container.addEventListener('click', function(e) {
                var tgt = e.target;

                if (tgt.nodeName.toLowerCase() === 'li' && tgt.dataset.flag === 'indicator') {
                    var idx = toNumber(tgt.dataset.page);
                    that.goto(that.getPage(idx));
                } else if (tgt.dataset.flag === 'arrow') {
                    var toPage = tgt.dataset.direction === 'prev' ? 'prevPage' : 'nextPage';
                    that[toPage]();
                }
            });

            //recognize gestures made by touch
            var Hammer = window.Hammer;
            if (Hammer !== undefined) {
                var hm = new Hammer(this.container);
                hm.get('swipe').set({
                    direction: Hammer.DIRECTION_ALL
                });


                hm.on('swipe', function(e) {
                    if (e.direction === Hammer.DIRECTION_RIGHT || e.direction === Hammer.DIRECTION_DOWN) {
                        that.prevPage();
                    } else {
                        that.nextPage();
                    }

                });
            }

        },
        //Go to page by id
        goto: function(page) {
            if (page) {
                if (this.config.urlHash) {
                    triggerEvent(page, 'html5show.pageEnter');
                } else {
                    this.setIdx(page.idx);
                }
            }
        },
        //Get page index from hash
        idxFromHash: function() {
            var page = this.pageMap[getIdFromHash()];
            return page ? page.idx : 0;
        },

        //Get page element by index specified, if idx argument is not passed, index is set to this.idx
        getPage: function(idx) {
            if (idx === undefined) {
                idx = this.idx;
            }
            var page = idx >= 0 && idx < this.pageCount ? this.pages[idx] : this.pages[0];
            if (!page.inited) {
                this.initPage(page);
            }
            return page;
        },

        //Set page index, hide last page if exists ,then show page
        setIdx: function(idx) {
            if (idx < 0 || idx > this.pageCount - 1) {
                warn('idx:' + idx + ' is not valid !');
                return;
            }
            this.idx = idx;
            this.calcPageAnimation();
            if (this.lastIdx >= 0) {
                this.hidePage(this.lastIdx);
            }
            this.showPage(idx);
            if (this.config.indicator) {
                this.updateIndicator(idx);
            }

            if (this.config.arrow) {
                this.updateArrow(idx);
            }
        },
        //Ativate current indicator
        updateIndicator: function(idx) {
            if (!this.config.indicator) {
                return;
            }
            addClass(this.indicator, 'hide');
            var page = this.getPage(idx);
            if (this.pageCount > 1 && page.config.indicator) {
                removeClass(this.indicator, 'hide');
            }
            var list = $$('li', this.indicator);

            for (var i in list) {
                var li = list[i];
                removeClass(li, 'active');
                if (idx === toNumber(i)) {
                    addClass(li, 'active');
                }
            }
        },
        //Update arrow's show/hide
        updateArrow: function(idx) {
            if (!this.config.arrow) {
                return;
            }

            addClass(this.arrowPrev, 'hide');
            addClass(this.arrowNext, 'hide');
            if (this.pageCount === 0) {
                return;
            }
            var page = this.getPage(idx);
            if (this.pageCount > 1 && page.config.arrow) {
                if (idx > 0) {
                    removeClass(this.arrowPrev, 'hide');
                }
                removeClass(this.arrowNext, 'hide');
            }

        },
        //Hide sprites of the page
        hideSprites: function(page) {
            var sprites = this.sprites[page.id];
            if (sprites) {
                for (var i = 0; i < sprites.length; i++) {
                    var sprite = sprites[i];
                    _hideElement(sprite);
                }
            }
        },
        //Reset sprites of the page
        resetSprites: function(page) {
            var sprites = this.sprites[page.id];
            if (sprites) {
                for (var i = 0; i < sprites.length; i++) {
                    var sprite = sprites[i];
                    _resetElement(sprite);
                }
            }
        },

        //Hide page by index
        hidePage: function(idx) {
            var page = this.getPage(idx);
            var that = this;
            if (page) {
                var cfg = page.config;
                removeClass(page, cfg._show);
                addClass(page, cfg._hide);

                delay(that.hidePageHandler, cfg.duration, function() {
                    if (that.idx !== idx) {
                        removeClass(page, _cPageActive, _cAnimated, cfg._hide);
                        that.hideSprites(page);
                    }
                });
            }
        },



        //Calculate the page animation show and hide class, then add to page config _show/_hide
        calcPageAnimation: function() {
            if (this.pageCount === 1) {
                return;
            }
            var lastPage = this.lastIdx >= 0 ? this.getPage(this.lastIdx) : null;
            var lcfg = lastPage ? lastPage.config : null;
            var page = this.getPage(this.idx);
            var cfg = page.config;
            var isHor = this.config.direction === 'horizontal';
            removeClass(page, cfg._hide);
            if (this.lastIdx < this.idx) {
                if (lcfg) {
                    removeClass(lastPage, lcfg._hide);
                    lcfg._hide = lcfg.hide || (isHor ? _cPageAni.toL : _cPageAni.toT);
                }
                cfg._show = cfg.show || (isHor ? _cPageAni.fromR : _cPageAni.fromB);
            } else {

                if (lcfg) {
                    removeClass(lastPage, lcfg._hide);
                    lcfg._hide = lcfg.hide || (isHor ? _cPageAni.toR : _cPageAni.toB);
                }
                cfg._show = cfg.show || (isHor ? _cPageAni.fromL : _cPageAni.fromT);
            }
        },

        //Show and animate the sprites of the page
        showSprites: function(page) {
            var sprites = this.sprites[page.id];
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                _animateElement(sprite, this.spritesHandlers);
            }
        },

        //Show page by index
        showPage: function(idx) {

            window.clearTimeout(this.playHandler);
            var page = this.getPage(idx);
            addClass(page, _cAnimated, _cPageActive, page.config._show);
            this.resetSprites(page);

            clearSpriteHandlers(this.spritesHandlers);

            this.showSprites(page);
            this.lastIdx = page.idx;

            this.prepareNext(idx);

        },
        //Prepare next page to show
        prepareNext: function(idx) {
            var page = this.getPage(idx);
            //If play is true, show next page after stay time
            if (this.config.play) {
                var that = this;
                that.playHandler = delay(that.playHandler, page.config.duration + that.calcPageStay(page), function() {
                    that.nextPage();
                });
            }
        },
        //Calculate the stay time of the page
        calcPageStay: function(page) {
            var stay = page.config.stay;
            //Max sprites time + duration
            var msd = 0;
            var sprites = this.sprites[page.id];
            if (sprites && sprites.length) {
                for (var i in sprites) {
                    var sp = sprites[i];
                    var scfg = sp.config;
                    if (scfg) {
                        var time = scfg.time ? toNumber(scfg.time) : 0;
                        time += scfg.stay ? toNumber(scfg.stay) : 0;
                        //time+=page.config.duration;

                        msd = Math.max(msd, time + scfg.duration);
                    }
                }
            }
            //if calculated msd larger than config.stay than use  msd,if not use config.stay
            return Math.max(stay, msd);
        },

        //Show next page
        nextPage: function() {
            var idx = this.idx < this.pageCount - 1 ? this.idx + 1 : 0;
            this.goto(this.getPage(idx));
        },
        //Show previous page
        prevPage: function() {
            if (this.idx > 0) {
                var idx = this.idx - 1;
                this.goto(this.getPage(idx));
            }
        }

        //Events

    };



    window.html5show = html5show;

}(document, window));
