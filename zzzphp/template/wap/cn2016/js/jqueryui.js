(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    var dataSpace = "ui-effects-",
        jQuery = $;
    $.effects = {
        effect: {}
    };
    (function(jQuery, undefined) {
        var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
            rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
            stringParsers = [{
                re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(execResult) {
                    return [execResult[1], execResult[2], execResult[3], execResult[4]];
                }
            }, {
                re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(execResult) {
                    return [execResult[1] * 2.55, execResult[2] * 2.55, execResult[3] * 2.55, execResult[4]];
                }
            }, {
                re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                parse: function(execResult) {
                    return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
                }
            }, {
                re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                parse: function(execResult) {
                    return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
                }
            }, {
                re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                space: "hsla",
                parse: function(execResult) {
                    return [execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4]];
                }
            }],
            color = jQuery.Color = function(color, green, blue, alpha) {
                return new jQuery.Color.fn.parse(color, green, blue, alpha);
            }, spaces = {
                rgba: {
                    props: {
                        red: {
                            idx: 0,
                            type: "byte"
                        },
                        green: {
                            idx: 1,
                            type: "byte"
                        },
                        blue: {
                            idx: 2,
                            type: "byte"
                        }
                    }
                },
                hsla: {
                    props: {
                        hue: {
                            idx: 0,
                            type: "degrees"
                        },
                        saturation: {
                            idx: 1,
                            type: "percent"
                        },
                        lightness: {
                            idx: 2,
                            type: "percent"
                        }
                    }
                }
            }, propTypes = {
                "byte": {
                    floor: true,
                    max: 255
                },
                "percent": {
                    max: 1
                },
                "degrees": {
                    mod: 360,
                    floor: true
                }
            }, support = color.support = {}, supportElem = jQuery("<p>")[0],
            colors, each = jQuery.each;
        supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
        support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1;
        each(spaces, function(spaceName, space) {
            space.cache = "_" + spaceName;
            space.props.alpha = {
                idx: 3,
                type: "percent",
                def: 1
            };
        });

        function clamp(value, prop, allowEmpty) {
            var type = propTypes[prop.type] || {};
            if (value == null) {
                return (allowEmpty || !prop.def) ? null : prop.def;
            }
            value = type.floor ? ~~value : parseFloat(value);
            if (isNaN(value)) {
                return prop.def;
            }
            if (type.mod) {
                return (value + type.mod) % type.mod;
            }
            return 0 > value ? 0 : type.max < value ? type.max : value;
        }

        function stringParse(string) {
            var inst = color(),
                rgba = inst._rgba = [];
            string = string.toLowerCase();
            each(stringParsers, function(i, parser) {
                var parsed, match = parser.re.exec(string),
                    values = match && parser.parse(match),
                    spaceName = parser.space || "rgba";
                if (values) {
                    parsed = inst[spaceName](values);
                    inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache];
                    rgba = inst._rgba = parsed._rgba;
                    return false;
                }
            });
            if (rgba.length) {
                if (rgba.join() === "0,0,0,0") {
                    jQuery.extend(rgba, colors.transparent);
                }
                return inst;
            }
            return colors[string];
        }
        color.fn = jQuery.extend(color.prototype, {
            parse: function(red, green, blue, alpha) {
                if (red === undefined) {
                    this._rgba = [null, null, null, null];
                    return this;
                }
                if (red.jquery || red.nodeType) {
                    red = jQuery(red).css(green);
                    green = undefined;
                }
                var inst = this,
                    type = jQuery.type(red),
                    rgba = this._rgba = [];
                if (green !== undefined) {
                    red = [red, green, blue, alpha];
                    type = "array";
                }
                if (type === "string") {
                    return this.parse(stringParse(red) || colors._default);
                }
                if (type === "array") {
                    each(spaces.rgba.props, function(key, prop) {
                        rgba[prop.idx] = clamp(red[prop.idx], prop);
                    });
                    return this;
                }
                if (type === "object") {
                    if (red instanceof color) {
                        each(spaces, function(spaceName, space) {
                            if (red[space.cache]) {
                                inst[space.cache] = red[space.cache].slice();
                            }
                        });
                    } else {
                        each(spaces, function(spaceName, space) {
                            var cache = space.cache;
                            each(space.props, function(key, prop) {
                                if (!inst[cache] && space.to) {
                                    if (key === "alpha" || red[key] == null) {
                                        return;
                                    }
                                    inst[cache] = space.to(inst._rgba);
                                }
                                inst[cache][prop.idx] = clamp(red[key], prop, true);
                            });
                            if (inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0) {
                                inst[cache][3] = 1;
                                if (space.from) {
                                    inst._rgba = space.from(inst[cache]);
                                }
                            }
                        });
                    }
                    return this;
                }
            },
            is: function(compare) {
                var is = color(compare),
                    same = true,
                    inst = this;
                each(spaces, function(_, space) {
                    var localCache, isCache = is[space.cache];
                    if (isCache) {
                        localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [];
                        each(space.props, function(_, prop) {
                            if (isCache[prop.idx] != null) {
                                same = (isCache[prop.idx] === localCache[prop.idx]);
                                return same;
                            }
                        });
                    }
                    return same;
                });
                return same;
            },
            _space: function() {
                var used = [],
                    inst = this;
                each(spaces, function(spaceName, space) {
                    if (inst[space.cache]) {
                        used.push(spaceName);
                    }
                });
                return used.pop();
            },
            transition: function(other, distance) {
                var end = color(other),
                    spaceName = end._space(),
                    space = spaces[spaceName],
                    startColor = this.alpha() === 0 ? color("transparent") : this,
                    start = startColor[space.cache] || space.to(startColor._rgba),
                    result = start.slice();
                end = end[space.cache];
                each(space.props, function(key, prop) {
                    var index = prop.idx,
                        startValue = start[index],
                        endValue = end[index],
                        type = propTypes[prop.type] || {};
                    if (endValue === null) {
                        return;
                    }
                    if (startValue === null) {
                        result[index] = endValue;
                    } else {
                        if (type.mod) {
                            if (endValue - startValue > type.mod / 2) {
                                startValue += type.mod;
                            } else if (startValue - endValue > type.mod / 2) {
                                startValue -= type.mod;
                            }
                        }
                        result[index] = clamp((endValue - startValue) * distance + startValue, prop);
                    }
                });
                return this[spaceName](result);
            },
            blend: function(opaque) {
                if (this._rgba[3] === 1) {
                    return this;
                }
                var rgb = this._rgba.slice(),
                    a = rgb.pop(),
                    blend = color(opaque)._rgba;
                return color(jQuery.map(rgb, function(v, i) {
                    return (1 - a) * blend[i] + a * v;
                }));
            },
            toRgbaString: function() {
                var prefix = "rgba(",
                    rgba = jQuery.map(this._rgba, function(v, i) {
                        return v == null ? (i > 2 ? 1 : 0) : v;
                    });
                if (rgba[3] === 1) {
                    rgba.pop();
                    prefix = "rgb(";
                }
                return prefix + rgba.join() + ")";
            },
            toHslaString: function() {
                var prefix = "hsla(",
                    hsla = jQuery.map(this.hsla(), function(v, i) {
                        if (v == null) {
                            v = i > 2 ? 1 : 0;
                        }
                        if (i && i < 3) {
                            v = Math.round(v * 100) + "%";
                        }
                        return v;
                    });
                if (hsla[3] === 1) {
                    hsla.pop();
                    prefix = "hsl(";
                }
                return prefix + hsla.join() + ")";
            },
            toHexString: function(includeAlpha) {
                var rgba = this._rgba.slice(),
                    alpha = rgba.pop();
                if (includeAlpha) {
                    rgba.push(~~(alpha * 255));
                }
                return "#" + jQuery.map(rgba, function(v) {
                    v = (v || 0).toString(16);
                    return v.length === 1 ? "0" + v : v;
                }).join("");
            },
            toString: function() {
                return this._rgba[3] === 0 ? "transparent" : this.toRgbaString();
            }
        });
        color.fn.parse.prototype = color.fn;

        function hue2rgb(p, q, h) {
            h = (h + 1) % 1;
            if (h * 6 < 1) {
                return p + (q - p) * h * 6;
            }
            if (h * 2 < 1) {
                return q;
            }
            if (h * 3 < 2) {
                return p + (q - p) * ((2 / 3) - h) * 6;
            }
            return p;
        }
        spaces.hsla.to = function(rgba) {
            if (rgba[0] == null || rgba[1] == null || rgba[2] == null) {
                return [null, null, null, rgba[3]];
            }
            var r = rgba[0] / 255,
                g = rgba[1] / 255,
                b = rgba[2] / 255,
                a = rgba[3],
                max = Math.max(r, g, b),
                min = Math.min(r, g, b),
                diff = max - min,
                add = max + min,
                l = add * 0.5,
                h, s;
            if (min === max) {
                h = 0;
            } else if (r === max) {
                h = (60 * (g - b) / diff) + 360;
            } else if (g === max) {
                h = (60 * (b - r) / diff) + 120;
            } else {
                h = (60 * (r - g) / diff) + 240;
            }
            if (diff === 0) {
                s = 0;
            } else if (l <= 0.5) {
                s = diff / add;
            } else {
                s = diff / (2 - add);
            }
            return [Math.round(h) % 360, s, l, a == null ? 1 : a];
        };
        spaces.hsla.from = function(hsla) {
            if (hsla[0] == null || hsla[1] == null || hsla[2] == null) {
                return [null, null, null, hsla[3]];
            }
            var h = hsla[0] / 360,
                s = hsla[1],
                l = hsla[2],
                a = hsla[3],
                q = l <= 0.5 ? l * (1 + s) : l + s - l * s,
                p = 2 * l - q;
            return [Math.round(hue2rgb(p, q, h + (1 / 3)) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - (1 / 3)) * 255), a];
        };
        each(spaces, function(spaceName, space) {
            var props = space.props,
                cache = space.cache,
                to = space.to,
                from = space.from;
            color.fn[spaceName] = function(value) {
                if (to && !this[cache]) {
                    this[cache] = to(this._rgba);
                }
                if (value === undefined) {
                    return this[cache].slice();
                }
                var ret, type = jQuery.type(value),
                    arr = (type === "array" || type === "object") ? value : arguments,
                    local = this[cache].slice();
                each(props, function(key, prop) {
                    var val = arr[type === "object" ? key : prop.idx];
                    if (val == null) {
                        val = local[prop.idx];
                    }
                    local[prop.idx] = clamp(val, prop);
                });
                if (from) {
                    ret = color(from(local));
                    ret[cache] = local;
                    return ret;
                } else {
                    return color(local);
                }
            };
            each(props, function(key, prop) {
                if (color.fn[key]) {
                    return;
                }
                color.fn[key] = function(value) {
                    var vtype = jQuery.type(value),
                        fn = (key === "alpha" ? (this._hsla ? "hsla" : "rgba") : spaceName),
                        local = this[fn](),
                        cur = local[prop.idx],
                        match;
                    if (vtype === "undefined") {
                        return cur;
                    }
                    if (vtype === "function") {
                        value = value.call(this, cur);
                        vtype = jQuery.type(value);
                    }
                    if (value == null && prop.empty) {
                        return this;
                    }
                    if (vtype === "string") {
                        match = rplusequals.exec(value);
                        if (match) {
                            value = cur + parseFloat(match[2]) * (match[1] === "+" ? 1 : -1);
                        }
                    }
                    local[prop.idx] = value;
                    return this[fn](local);
                };
            });
        });
        color.hook = function(hook) {
            var hooks = hook.split(" ");
            each(hooks, function(i, hook) {
                jQuery.cssHooks[hook] = {
                    set: function(elem, value) {
                        var parsed, curElem, backgroundColor = "";
                        if (value !== "transparent" && (jQuery.type(value) !== "string" || (parsed = stringParse(value)))) {
                            value = color(parsed || value);
                            if (!support.rgba && value._rgba[3] !== 1) {
                                curElem = hook === "backgroundColor" ? elem.parentNode : elem;
                                while ((backgroundColor === "" || backgroundColor === "transparent") && curElem && curElem.style) {
                                    try {
                                        backgroundColor = jQuery.css(curElem, "backgroundColor");
                                        curElem = curElem.parentNode;
                                    } catch (e) {}
                                }
                                value = value.blend(backgroundColor && backgroundColor !== "transparent" ? backgroundColor : "_default");
                            }
                            value = value.toRgbaString();
                        }
                        try {
                            elem.style[hook] = value;
                        } catch (e) {}
                    }
                };
                jQuery.fx.step[hook] = function(fx) {
                    if (!fx.colorInit) {
                        fx.start = color(fx.elem, hook);
                        fx.end = color(fx.end);
                        fx.colorInit = true;
                    }
                    jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
                };
            });
        };
        color.hook(stepHooks);
        jQuery.cssHooks.borderColor = {
            expand: function(value) {
                var expanded = {};
                each(["Top", "Right", "Bottom", "Left"], function(i, part) {
                    expanded["border" + part + "Color"] = value;
                });
                return expanded;
            }
        };
        colors = jQuery.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        };
    })(jQuery);
    (function() {
        var classAnimationActions = ["add", "remove", "toggle"],
            shorthandStyles = {
                border: 1,
                borderBottom: 1,
                borderColor: 1,
                borderLeft: 1,
                borderRight: 1,
                borderTop: 1,
                borderWidth: 1,
                margin: 1,
                padding: 1
            };
        $.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(_, prop) {
            $.fx.step[prop] = function(fx) {
                if (fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr) {
                    jQuery.style(fx.elem, prop, fx.end);
                    fx.setAttr = true;
                }
            };
        });

        function getElementStyles(elem) {
            var key, len, style = elem.ownerDocument.defaultView ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.currentStyle,
                styles = {};
            if (style && style.length && style[0] && style[style[0]]) {
                len = style.length;
                while (len--) {
                    key = style[len];
                    if (typeof style[key] === "string") {
                        styles[$.camelCase(key)] = style[key];
                    }
                }
            } else {
                for (key in style) {
                    if (typeof style[key] === "string") {
                        styles[key] = style[key];
                    }
                }
            }
            return styles;
        }

        function styleDifference(oldStyle, newStyle) {
            var diff = {}, name, value;
            for (name in newStyle) {
                value = newStyle[name];
                if (oldStyle[name] !== value) {
                    if (!shorthandStyles[name]) {
                        if ($.fx.step[name] || !isNaN(parseFloat(value))) {
                            diff[name] = value;
                        }
                    }
                }
            }
            return diff;
        }
        if (!$.fn.addBack) {
            $.fn.addBack = function(selector) {
                return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
            };
        }
        $.effects.animateClass = function(value, duration, easing, callback) {
            var o = $.speed(duration, easing, callback);
            return this.queue(function() {
                var animated = $(this),
                    baseClass = animated.attr("class") || "",
                    applyClassChange, allAnimations = o.children ? animated.find("*").addBack() : animated;
                allAnimations = allAnimations.map(function() {
                    var el = $(this);
                    return {
                        el: el,
                        start: getElementStyles(this)
                    };
                });
                applyClassChange = function() {
                    $.each(classAnimationActions, function(i, action) {
                        if (value[action]) {
                            animated[action + "Class"](value[action]);
                        }
                    });
                };
                applyClassChange();
                allAnimations = allAnimations.map(function() {
                    this.end = getElementStyles(this.el[0]);
                    this.diff = styleDifference(this.start, this.end);
                    return this;
                });
                animated.attr("class", baseClass);
                allAnimations = allAnimations.map(function() {
                    var styleInfo = this,
                        dfd = $.Deferred(),
                        opts = $.extend({}, o, {
                            queue: false,
                            complete: function() {
                                dfd.resolve(styleInfo);
                            }
                        });
                    this.el.animate(this.diff, opts);
                    return dfd.promise();
                });
                $.when.apply($, allAnimations.get()).done(function() {
                    applyClassChange();
                    $.each(arguments, function() {
                        var el = this.el;
                        $.each(this.diff, function(key) {
                            el.css(key, "");
                        });
                    });
                    o.complete.call(animated[0]);
                });
            });
        };
        $.fn.extend({
            addClass: (function(orig) {
                return function(classNames, speed, easing, callback) {
                    return speed ? $.effects.animateClass.call(this, {
                        add: classNames
                    }, speed, easing, callback) : orig.apply(this, arguments);
                };
            })($.fn.addClass),
            removeClass: (function(orig) {
                return function(classNames, speed, easing, callback) {
                    return arguments.length > 1 ? $.effects.animateClass.call(this, {
                        remove: classNames
                    }, speed, easing, callback) : orig.apply(this, arguments);
                };
            })($.fn.removeClass),
            toggleClass: (function(orig) {
                return function(classNames, force, speed, easing, callback) {
                    if (typeof force === "boolean" || force === undefined) {
                        if (!speed) {
                            return orig.apply(this, arguments);
                        } else {
                            return $.effects.animateClass.call(this, (force ? {
                                add: classNames
                            } : {
                                remove: classNames
                            }), speed, easing, callback);
                        }
                    } else {
                        return $.effects.animateClass.call(this, {
                            toggle: classNames
                        }, force, speed, easing);
                    }
                };
            })($.fn.toggleClass),
            switchClass: function(remove, add, speed, easing, callback) {
                return $.effects.animateClass.call(this, {
                    add: add,
                    remove: remove
                }, speed, easing, callback);
            }
        });
    })();
    (function() {
        $.extend($.effects, {
            version: "1.11.2",
            save: function(element, set) {
                for (var i = 0; i < set.length; i++) {
                    if (set[i] !== null) {
                        element.data(dataSpace + set[i], element[0].style[set[i]]);
                    }
                }
            },
            restore: function(element, set) {
                var val, i;
                for (i = 0; i < set.length; i++) {
                    if (set[i] !== null) {
                        val = element.data(dataSpace + set[i]);
                        if (val === undefined) {
                            val = "";
                        }
                        element.css(set[i], val);
                    }
                }
            },
            setMode: function(el, mode) {
                if (mode === "toggle") {
                    mode = el.is(":hidden") ? "show" : "hide";
                }
                return mode;
            },
            getBaseline: function(origin, original) {
                var y, x;
                switch (origin[0]) {
                    case "top":
                        y = 0;
                        break;
                    case "middle":
                        y = 0.5;
                        break;
                    case "bottom":
                        y = 1;
                        break;
                    default:
                        y = origin[0] / original.height;
                }
                switch (origin[1]) {
                    case "left":
                        x = 0;
                        break;
                    case "center":
                        x = 0.5;
                        break;
                    case "right":
                        x = 1;
                        break;
                    default:
                        x = origin[1] / original.width;
                }
                return {
                    x: x,
                    y: y
                };
            },
            createWrapper: function(element) {
                if (element.parent().is(".ui-effects-wrapper")) {
                    return element.parent();
                }
                var props = {
                    width: element.outerWidth(true),
                    height: element.outerHeight(true),
                    "float": element.css("float")
                }, wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
                        fontSize: "100%",
                        background: "transparent",
                        border: "none",
                        margin: 0,
                        padding: 0
                    }),
                    size = {
                        width: element.width(),
                        height: element.height()
                    }, active = document.activeElement;
                try {
                    active.id;
                } catch (e) {
                    active = document.body;
                }
                element.wrap(wrapper);
                if (element[0] === active || $.contains(element[0], active)) {
                    $(active).focus();
                }
                wrapper = element.parent();
                if (element.css("position") === "static") {
                    wrapper.css({
                        position: "relative"
                    });
                    element.css({
                        position: "relative"
                    });
                } else {
                    $.extend(props, {
                        position: element.css("position"),
                        zIndex: element.css("z-index")
                    });
                    $.each(["top", "left", "bottom", "right"], function(i, pos) {
                        props[pos] = element.css(pos);
                        if (isNaN(parseInt(props[pos], 10))) {
                            props[pos] = "auto";
                        }
                    });
                    element.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: "auto",
                        bottom: "auto"
                    });
                }
                element.css(size);
                return wrapper.css(props).show();
            },
            removeWrapper: function(element) {
                var active = document.activeElement;
                if (element.parent().is(".ui-effects-wrapper")) {
                    element.parent().replaceWith(element);
                    if (element[0] === active || $.contains(element[0], active)) {
                        $(active).focus();
                    }
                }
                return element;
            },
            setTransition: function(element, list, factor, value) {
                value = value || {};
                $.each(list, function(i, x) {
                    var unit = element.cssUnit(x);
                    if (unit[0] > 0) {
                        value[x] = unit[0] * factor + unit[1];
                    }
                });
                return value;
            }
        });

        function _normalizeArguments(effect, options, speed, callback) {
            if ($.isPlainObject(effect)) {
                options = effect;
                effect = effect.effect;
            }
            effect = {
                effect: effect
            };
            if (options == null) {
                options = {};
            }
            if ($.isFunction(options)) {
                callback = options;
                speed = null;
                options = {};
            }
            if (typeof options === "number" || $.fx.speeds[options]) {
                callback = speed;
                speed = options;
                options = {};
            }
            if ($.isFunction(speed)) {
                callback = speed;
                speed = null;
            }
            if (options) {
                $.extend(effect, options);
            }
            speed = speed || options.duration;
            effect.duration = $.fx.off ? 0 : typeof speed === "number" ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;
            effect.complete = callback || options.complete;
            return effect;
        }

        function standardAnimationOption(option) {
            if (!option || typeof option === "number" || $.fx.speeds[option]) {
                return true;
            }
            if (typeof option === "string" && !$.effects.effect[option]) {
                return true;
            }
            if ($.isFunction(option)) {
                return true;
            }
            if (typeof option === "object" && !option.effect) {
                return true;
            }
            return false;
        }
        $.fn.extend({
            effect: function() {
                var args = _normalizeArguments.apply(this, arguments),
                    mode = args.mode,
                    queue = args.queue,
                    effectMethod = $.effects.effect[args.effect];
                if ($.fx.off || !effectMethod) {
                    if (mode) {
                        return this[mode](args.duration, args.complete);
                    } else {
                        return this.each(function() {
                            if (args.complete) {
                                args.complete.call(this);
                            }
                        });
                    }
                }

                function run(next) {
                    var elem = $(this),
                        complete = args.complete,
                        mode = args.mode;

                    function done() {
                        if ($.isFunction(complete)) {
                            complete.call(elem[0]);
                        }
                        if ($.isFunction(next)) {
                            next();
                        }
                    }
                    if (elem.is(":hidden") ? mode === "hide" : mode === "show") {
                        elem[mode]();
                        done();
                    } else {
                        effectMethod.call(elem[0], args, done);
                    }
                }
                return queue === false ? this.each(run) : this.queue(queue || "fx", run);
            },
            show: (function(orig) {
                return function(option) {
                    if (standardAnimationOption(option)) {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "show";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.show),
            hide: (function(orig) {
                return function(option) {
                    if (standardAnimationOption(option)) {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "hide";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.hide),
            toggle: (function(orig) {
                return function(option) {
                    if (standardAnimationOption(option) || typeof option === "boolean") {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "toggle";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.toggle),
            cssUnit: function(key) {
                var style = this.css(key),
                    val = [];
                $.each(["em", "px", "%", "pt"], function(i, unit) {
                    if (style.indexOf(unit) > 0) {
                        val = [parseFloat(style), unit];
                    }
                });
                return val;
            }
        });
    })();
    (function() {
        var baseEasings = {};
        $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(i, name) {
            baseEasings[name] = function(p) {
                return Math.pow(p, i + 2);
            };
        });
        $.extend(baseEasings, {
            Sine: function(p) {
                return 1 - Math.cos(p * Math.PI / 2);
            },
            Circ: function(p) {
                return 1 - Math.sqrt(1 - p * p);
            },
            Elastic: function(p) {
                return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
            },
            Back: function(p) {
                return p * p * (3 * p - 2);
            },
            Bounce: function(p) {
                var pow2, bounce = 4;
                while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
                return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
            }
        });
        $.each(baseEasings, function(name, easeIn) {
            $.easing["easeIn" + name] = easeIn;
            $.easing["easeOut" + name] = function(p) {
                return 1 - easeIn(1 - p);
            };
            $.easing["easeInOut" + name] = function(p) {
                return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
            };
        });
    })();
    var effect = $.effects;
    var effectBlind = $.effects.effect.blind = function(o, done) {
        var el = $(this),
            rvertical = /up|down|vertical/,
            rpositivemotion = /up|left|vertical|horizontal/,
            props = ["position", "top", "bottom", "left", "right", "height", "width"],
            mode = $.effects.setMode(el, o.mode || "hide"),
            direction = o.direction || "up",
            vertical = rvertical.test(direction),
            ref = vertical ? "height" : "width",
            ref2 = vertical ? "top" : "left",
            motion = rpositivemotion.test(direction),
            animation = {}, show = mode === "show",
            wrapper, distance, margin;
        if (el.parent().is(".ui-effects-wrapper")) {
            $.effects.save(el.parent(), props);
        } else {
            $.effects.save(el, props);
        }
        el.show();
        wrapper = $.effects.createWrapper(el).css({
            overflow: "hidden"
        });
        distance = wrapper[ref]();
        margin = parseFloat(wrapper.css(ref2)) || 0;
        animation[ref] = show ? distance : 0;
        if (!motion) {
            el.css(vertical ? "bottom" : "right", 0).css(vertical ? "top" : "left", "auto").css({
                position: "absolute"
            });
            animation[ref2] = show ? margin : distance + margin;
        }
        if (show) {
            wrapper.css(ref, 0);
            if (!motion) {
                wrapper.css(ref2, margin + distance);
            }
        }
        wrapper.animate(animation, {
            duration: o.duration,
            easing: o.easing,
            queue: false,
            complete: function() {
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });
    };
    var effectBounce = $.effects.effect.bounce = function(o, done) {
        var el = $(this),
            props = ["position", "top", "bottom", "left", "right", "height", "width"],
            mode = $.effects.setMode(el, o.mode || "effect"),
            hide = mode === "hide",
            show = mode === "show",
            direction = o.direction || "up",
            distance = o.distance,
            times = o.times || 5,
            anims = times * 2 + (show || hide ? 1 : 0),
            speed = o.duration / anims,
            easing = o.easing,
            ref = (direction === "up" || direction === "down") ? "top" : "left",
            motion = (direction === "up" || direction === "left"),
            i, upAnim, downAnim, queue = el.queue(),
            queuelen = queue.length;
        if (show || hide) {
            props.push("opacity");
        }
        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el);
        if (!distance) {
            distance = el[ref === "top" ? "outerHeight" : "outerWidth"]() / 3;
        }
        if (show) {
            downAnim = {
                opacity: 1
            };
            downAnim[ref] = 0;
            el.css("opacity", 0).css(ref, motion ? -distance * 2 : distance * 2).animate(downAnim, speed, easing);
        }
        if (hide) {
            distance = distance / Math.pow(2, times - 1);
        }
        downAnim = {};
        downAnim[ref] = 0;
        for (i = 0; i < times; i++) {
            upAnim = {};
            upAnim[ref] = (motion ? "-=" : "+=") + distance;
            el.animate(upAnim, speed, easing).animate(downAnim, speed, easing);
            distance = hide ? distance * 2 : distance / 2;
        }
        if (hide) {
            upAnim = {
                opacity: 0
            };
            upAnim[ref] = (motion ? "-=" : "+=") + distance;
            el.animate(upAnim, speed, easing);
        }
        el.queue(function() {
            if (hide) {
                el.hide();
            }
            $.effects.restore(el, props);
            $.effects.removeWrapper(el);
            done();
        });
        if (queuelen > 1) {
            queue.splice.apply(queue, [1, 0].concat(queue.splice(queuelen, anims + 1)));
        }
        el.dequeue();
    };
    var effectClip = $.effects.effect.clip = function(o, done) {
        var el = $(this),
            props = ["position", "top", "bottom", "left", "right", "height", "width"],
            mode = $.effects.setMode(el, o.mode || "hide"),
            show = mode === "show",
            direction = o.direction || "vertical",
            vert = direction === "vertical",
            size = vert ? "height" : "width",
            position = vert ? "top" : "left",
            animation = {}, wrapper, animate, distance;
        $.effects.save(el, props);
        el.show();
        wrapper = $.effects.createWrapper(el).css({
            overflow: "hidden"
        });
        animate = (el[0].tagName === "IMG") ? wrapper : el;
        distance = animate[size]();
        if (show) {
            animate.css(size, 0);
            animate.css(position, distance / 2);
        }
        animation[size] = show ? distance : 0;
        animation[position] = show ? 0 : distance / 2;
        animate.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function() {
                if (!show) {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });
    };
    var effectDrop = $.effects.effect.drop = function(o, done) {
        var el = $(this),
            props = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"],
            mode = $.effects.setMode(el, o.mode || "hide"),
            show = mode === "show",
            direction = o.direction || "left",
            ref = (direction === "up" || direction === "down") ? "top" : "left",
            motion = (direction === "up" || direction === "left") ? "pos" : "neg",
            animation = {
                opacity: show ? 1 : 0
            }, distance;
        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el);
        distance = o.distance || el[ref === "top" ? "outerHeight" : "outerWidth"](true) / 2;
        if (show) {
            el.css("opacity", 0).css(ref, motion === "pos" ? -distance : distance);
        }
        animation[ref] = (show ? (motion === "pos" ? "+=" : "-=") : (motion === "pos" ? "-=" : "+=")) + distance;
        el.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function() {
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });
    };
    var effectExplode = $.effects.effect.explode = function(o, done) {
        var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3,
            cells = rows,
            el = $(this),
            mode = $.effects.setMode(el, o.mode || "hide"),
            show = mode === "show",
            offset = el.show().css("visibility", "hidden").offset(),
            width = Math.ceil(el.outerWidth() / cells),
            height = Math.ceil(el.outerHeight() / rows),
            pieces = [],
            i, j, left, top, mx, my;

        function childComplete() {
            pieces.push(this);
            if (pieces.length === rows * cells) {
                animComplete();
            }
        }
        for (i = 0; i < rows; i++) {
            top = offset.top + i * height;
            my = i - (rows - 1) / 2;
            for (j = 0; j < cells; j++) {
                left = offset.left + j * width;
                mx = j - (cells - 1) / 2;
                el.clone().appendTo("body").wrap("<div></div>").css({
                    position: "absolute",
                    visibility: "visible",
                    left: -j * width,
                    top: -i * height
                }).parent().addClass("ui-effects-explode").css({
                    position: "absolute",
                    overflow: "hidden",
                    width: width,
                    height: height,
                    left: left + (show ? mx * width : 0),
                    top: top + (show ? my * height : 0),
                    opacity: show ? 0 : 1
                }).animate({
                    left: left + (show ? 0 : mx * width),
                    top: top + (show ? 0 : my * height),
                    opacity: show ? 1 : 0
                }, o.duration || 500, o.easing, childComplete);
            }
        }

        function animComplete() {
            el.css({
                visibility: "visible"
            });
            $(pieces).remove();
            if (!show) {
                el.hide();
            }
            done();
        }
    };
    var effectFade = $.effects.effect.fade = function(o, done) {
        var el = $(this),
            mode = $.effects.setMode(el, o.mode || "toggle");
        el.animate({
            opacity: mode
        }, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: done
        });
    };
    var effectFold = $.effects.effect.fold = function(o, done) {
        var el = $(this),
            props = ["position", "top", "bottom", "left", "right", "height", "width"],
            mode = $.effects.setMode(el, o.mode || "hide"),
            show = mode === "show",
            hide = mode === "hide",
            size = o.size || 15,
            percent = /([0-9]+)%/.exec(size),
            horizFirst = !! o.horizFirst,
            widthFirst = show !== horizFirst,
            ref = widthFirst ? ["width", "height"] : ["height", "width"],
            duration = o.duration / 2,
            wrapper, distance, animation1 = {}, animation2 = {};
        $.effects.save(el, props);
        el.show();
        wrapper = $.effects.createWrapper(el).css({
            overflow: "hidden"
        });
        distance = widthFirst ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
        if (percent) {
            size = parseInt(percent[1], 10) / 100 * distance[hide ? 0 : 1];
        }
        if (show) {
            wrapper.css(horizFirst ? {
                height: 0,
                width: size
            } : {
                height: size,
                width: 0
            });
        }
        animation1[ref[0]] = show ? distance[0] : size;
        animation2[ref[1]] = show ? distance[1] : 0;
        wrapper.animate(animation1, duration, o.easing).animate(animation2, duration, o.easing, function() {
            if (hide) {
                el.hide();
            }
            $.effects.restore(el, props);
            $.effects.removeWrapper(el);
            done();
        });
    };
    var effectHighlight = $.effects.effect.highlight = function(o, done) {
        var elem = $(this),
            props = ["backgroundImage", "backgroundColor", "opacity"],
            mode = $.effects.setMode(elem, o.mode || "show"),
            animation = {
                backgroundColor: elem.css("backgroundColor")
            };
        if (mode === "hide") {
            animation.opacity = 0;
        }
        $.effects.save(elem, props);
        elem.show().css({
            backgroundImage: "none",
            backgroundColor: o.color || "#ffff99"
        }).animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function() {
                if (mode === "hide") {
                    elem.hide();
                }
                $.effects.restore(elem, props);
                done();
            }
        });
    };
    var effectSize = $.effects.effect.size = function(o, done) {
        var original, baseline, factor, el = $(this),
            props0 = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"],
            props1 = ["position", "top", "bottom", "left", "right", "overflow", "opacity"],
            props2 = ["width", "height", "overflow"],
            cProps = ["fontSize"],
            vProps = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
            hProps = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
            mode = $.effects.setMode(el, o.mode || "effect"),
            restore = o.restore || mode !== "effect",
            scale = o.scale || "both",
            origin = o.origin || ["middle", "center"],
            position = el.css("position"),
            props = restore ? props0 : props1,
            zero = {
                height: 0,
                width: 0,
                outerHeight: 0,
                outerWidth: 0
            };
        if (mode === "show") {
            el.show();
        }
        original = {
            height: el.height(),
            width: el.width(),
            outerHeight: el.outerHeight(),
            outerWidth: el.outerWidth()
        };
        if (o.mode === "toggle" && mode === "show") {
            el.from = o.to || zero;
            el.to = o.from || original;
        } else {
            el.from = o.from || (mode === "show" ? zero : original);
            el.to = o.to || (mode === "hide" ? zero : original);
        }
        factor = {
            from: {
                y: el.from.height / original.height,
                x: el.from.width / original.width
            },
            to: {
                y: el.to.height / original.height,
                x: el.to.width / original.width
            }
        };
        if (scale === "box" || scale === "both") {
            if (factor.from.y !== factor.to.y) {
                props = props.concat(vProps);
                el.from = $.effects.setTransition(el, vProps, factor.from.y, el.from);
                el.to = $.effects.setTransition(el, vProps, factor.to.y, el.to);
            }
            if (factor.from.x !== factor.to.x) {
                props = props.concat(hProps);
                el.from = $.effects.setTransition(el, hProps, factor.from.x, el.from);
                el.to = $.effects.setTransition(el, hProps, factor.to.x, el.to);
            }
        }
        if (scale === "content" || scale === "both") {
            if (factor.from.y !== factor.to.y) {
                props = props.concat(cProps).concat(props2);
                el.from = $.effects.setTransition(el, cProps, factor.from.y, el.from);
                el.to = $.effects.setTransition(el, cProps, factor.to.y, el.to);
            }
        }
        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el);
        el.css("overflow", "hidden").css(el.from);
        if (origin) {
            baseline = $.effects.getBaseline(origin, original);
            el.from.top = (original.outerHeight - el.outerHeight()) * baseline.y;
            el.from.left = (original.outerWidth - el.outerWidth()) * baseline.x;
            el.to.top = (original.outerHeight - el.to.outerHeight) * baseline.y;
            el.to.left = (original.outerWidth - el.to.outerWidth) * baseline.x;
        }
        el.css(el.from);
        if (scale === "content" || scale === "both") {
            vProps = vProps.concat(["marginTop", "marginBottom"]).concat(cProps);
            hProps = hProps.concat(["marginLeft", "marginRight"]);
            props2 = props0.concat(vProps).concat(hProps);
            el.find("*[width]").each(function() {
                var child = $(this),
                    c_original = {
                        height: child.height(),
                        width: child.width(),
                        outerHeight: child.outerHeight(),
                        outerWidth: child.outerWidth()
                    };
                if (restore) {
                    $.effects.save(child, props2);
                }
                child.from = {
                    height: c_original.height * factor.from.y,
                    width: c_original.width * factor.from.x,
                    outerHeight: c_original.outerHeight * factor.from.y,
                    outerWidth: c_original.outerWidth * factor.from.x
                };
                child.to = {
                    height: c_original.height * factor.to.y,
                    width: c_original.width * factor.to.x,
                    outerHeight: c_original.height * factor.to.y,
                    outerWidth: c_original.width * factor.to.x
                };
                if (factor.from.y !== factor.to.y) {
                    child.from = $.effects.setTransition(child, vProps, factor.from.y, child.from);
                    child.to = $.effects.setTransition(child, vProps, factor.to.y, child.to);
                }
                if (factor.from.x !== factor.to.x) {
                    child.from = $.effects.setTransition(child, hProps, factor.from.x, child.from);
                    child.to = $.effects.setTransition(child, hProps, factor.to.x, child.to);
                }
                child.css(child.from);
                child.animate(child.to, o.duration, o.easing, function() {
                    if (restore) {
                        $.effects.restore(child, props2);
                    }
                });
            });
        }
        el.animate(el.to, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function() {
                if (el.to.opacity === 0) {
                    el.css("opacity", el.from.opacity);
                }
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                if (!restore) {
                    if (position === "static") {
                        el.css({
                            position: "relative",
                            top: el.to.top,
                            left: el.to.left
                        });
                    } else {
                        $.each(["top", "left"], function(idx, pos) {
                            el.css(pos, function(_, str) {
                                var val = parseInt(str, 10),
                                    toRef = idx ? el.to.left : el.to.top;
                                if (str === "auto") {
                                    return toRef + "px";
                                }
                                return val + toRef + "px";
                            });
                        });
                    }
                }
                $.effects.removeWrapper(el);
                done();
            }
        });
    };
    var effectScale = $.effects.effect.scale = function(o, done) {
        var el = $(this),
            options = $.extend(true, {}, o),
            mode = $.effects.setMode(el, o.mode || "effect"),
            percent = parseInt(o.percent, 10) || (parseInt(o.percent, 10) === 0 ? 0 : (mode === "hide" ? 0 : 100)),
            direction = o.direction || "both",
            origin = o.origin,
            original = {
                height: el.height(),
                width: el.width(),
                outerHeight: el.outerHeight(),
                outerWidth: el.outerWidth()
            }, factor = {
                y: direction !== "horizontal" ? (percent / 100) : 1,
                x: direction !== "vertical" ? (percent / 100) : 1
            };
        options.effect = "size";
        options.queue = false;
        options.complete = done;
        if (mode !== "effect") {
            options.origin = origin || ["middle", "center"];
            options.restore = true;
        }
        options.from = o.from || (mode === "show" ? {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
        } : original);
        options.to = {
            height: original.height * factor.y,
            width: original.width * factor.x,
            outerHeight: original.outerHeight * factor.y,
            outerWidth: original.outerWidth * factor.x
        };
        if (options.fade) {
            if (mode === "show") {
                options.from.opacity = 0;
                options.to.opacity = 1;
            }
            if (mode === "hide") {
                options.from.opacity = 1;
                options.to.opacity = 0;
            }
        }
        el.effect(options);
    };
    var effectPuff = $.effects.effect.puff = function(o, done) {
        var elem = $(this),
            mode = $.effects.setMode(elem, o.mode || "hide"),
            hide = mode === "hide",
            percent = parseInt(o.percent, 10) || 150,
            factor = percent / 100,
            original = {
                height: elem.height(),
                width: elem.width(),
                outerHeight: elem.outerHeight(),
                outerWidth: elem.outerWidth()
            };
        $.extend(o, {
            effect: "scale",
            queue: false,
            fade: true,
            mode: mode,
            complete: done,
            percent: hide ? percent : 100,
            from: hide ? original : {
                height: original.height * factor,
                width: original.width * factor,
                outerHeight: original.outerHeight * factor,
                outerWidth: original.outerWidth * factor
            }
        });
        elem.effect(o);
    };
    var effectPulsate = $.effects.effect.pulsate = function(o, done) {
        var elem = $(this),
            mode = $.effects.setMode(elem, o.mode || "show"),
            show = mode === "show",
            hide = mode === "hide",
            showhide = (show || mode === "hide"),
            anims = ((o.times || 5) * 2) + (showhide ? 1 : 0),
            duration = o.duration / anims,
            animateTo = 0,
            queue = elem.queue(),
            queuelen = queue.length,
            i;
        if (show || !elem.is(":visible")) {
            elem.css("opacity", 0).show();
            animateTo = 1;
        }
        for (i = 1; i < anims; i++) {
            elem.animate({
                opacity: animateTo
            }, duration, o.easing);
            animateTo = 1 - animateTo;
        }
        elem.animate({
            opacity: animateTo
        }, duration, o.easing);
        elem.queue(function() {
            if (hide) {
                elem.hide();
            }
            done();
        });
        if (queuelen > 1) {
            queue.splice.apply(queue, [1, 0].concat(queue.splice(queuelen, anims + 1)));
        }
        elem.dequeue();
    };
    var effectShake = $.effects.effect.shake = function(o, done) {
        var el = $(this),
            props = ["position", "top", "bottom", "left", "right", "height", "width"],
            mode = $.effects.setMode(el, o.mode || "effect"),
            direction = o.direction || "left",
            distance = o.distance || 20,
            times = o.times || 3,
            anims = times * 2 + 1,
            speed = Math.round(o.duration / anims),
            ref = (direction === "up" || direction === "down") ? "top" : "left",
            positiveMotion = (direction === "up" || direction === "left"),
            animation = {}, animation1 = {}, animation2 = {}, i, queue = el.queue(),
            queuelen = queue.length;
        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el);
        animation[ref] = (positiveMotion ? "-=" : "+=") + distance;
        animation1[ref] = (positiveMotion ? "+=" : "-=") + distance * 2;
        animation2[ref] = (positiveMotion ? "-=" : "+=") + distance * 2;
        el.animate(animation, speed, o.easing);
        for (i = 1; i < times; i++) {
            el.animate(animation1, speed, o.easing).animate(animation2, speed, o.easing);
        }
        el.animate(animation1, speed, o.easing).animate(animation, speed / 2, o.easing).queue(function() {
            if (mode === "hide") {
                el.hide();
            }
            $.effects.restore(el, props);
            $.effects.removeWrapper(el);
            done();
        });
        if (queuelen > 1) {
            queue.splice.apply(queue, [1, 0].concat(queue.splice(queuelen, anims + 1)));
        }
        el.dequeue();
    };
    var effectSlide = $.effects.effect.slide = function(o, done) {
        var el = $(this),
            props = ["position", "top", "bottom", "left", "right", "width", "height"],
            mode = $.effects.setMode(el, o.mode || "show"),
            show = mode === "show",
            direction = o.direction || "left",
            ref = (direction === "up" || direction === "down") ? "top" : "left",
            positiveMotion = (direction === "up" || direction === "left"),
            distance, animation = {};
        $.effects.save(el, props);
        el.show();
        distance = o.distance || el[ref === "top" ? "outerHeight" : "outerWidth"](true);
        $.effects.createWrapper(el).css({
            overflow: "hidden"
        });
        if (show) {
            el.css(ref, positiveMotion ? (isNaN(distance) ? "-" + distance : -distance) : distance);
        }
        animation[ref] = (show ? (positiveMotion ? "+=" : "-=") : (positiveMotion ? "-=" : "+=")) + distance;
        el.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function() {
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });
    };
    var effectTransfer = $.effects.effect.transfer = function(o, done) {
        var elem = $(this),
            target = $(o.to),
            targetFixed = target.css("position") === "fixed",
            body = $("body"),
            fixTop = targetFixed ? body.scrollTop() : 0,
            fixLeft = targetFixed ? body.scrollLeft() : 0,
            endPosition = target.offset(),
            animation = {
                top: endPosition.top - fixTop,
                left: endPosition.left - fixLeft,
                height: target.innerHeight(),
                width: target.innerWidth()
            }, startPosition = elem.offset(),
            transfer = $("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(o.className).css({
                top: startPosition.top - fixTop,
                left: startPosition.left - fixLeft,
                height: elem.innerHeight(),
                width: elem.innerWidth(),
                position: targetFixed ? "fixed" : "absolute"
            }).animate(animation, o.duration, o.easing, function() {
                transfer.remove();
                done();
            });
    };
}));