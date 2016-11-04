/**
 * Created by caoyanqi on 2016/10/24.
 */
(function (window) {

    function Quick(selector) {
        return new Quick.fn.init(selector);
    }

    Quick.fn = Quick.prototype = {
        constructor: Quick,
        length: 0,
        init: function (selector) {
            //判断传入的是null,undefined则不处理
            if (!selector) return this;
            //如果传入的是字符串
            if (typeof selector === "string") {
                //判断是否是HTML字符串
                if (selector.charAt(0) === "<") {
                    [].push.apply(this, parseHTML(selector));
                    return this;
                }
                //即为选择器
                else {
                    [].push.apply(this, document.querySelectorAll(selector));
                    return this;
                }
            }
            //如果是DOM对象
            if (selector.nodeType) {
                //传入的一定是 一个dom元素
                this[0] = selector;
                this.length = 1;
                return this;
            }
            //如果是Itcast对象
            if (selector.constructor.name === "Quick") {
                return selector;
            }
            //如果是函数
            if (typeof selector === "function") {
                loads.push(selector);
            }
            //如果传入的都不是，则进行数组处理
            if (selector.length >= 0) {
                [].push.apply(this, selector);   //数组
            } else {
                this[0] = selector;
                this.length = 1;
            }

        }
    }

    Quick.fn.init.prototype = Quick.fn;


    //extend  用于功能扩展的方法
    Quick.extend = Quick.fn.extend = function (obj) {
        var k;
        for (k in obj) {
            this[k] = obj[k];
        }
    }


    Quick.fn.extend({
        each: function (callback) {
            return Quick.each(this, callback);
        },
        map: function (callback) {
            return Quick.map(this, callback);
        }
    });

    Quick.extend({
        each: function (array, callback) {
            var i = 0,
                k,
                isArray = array.length >= 0;
            if (isArray) {
                for (; i < array.length; i++) {
                    if (callback.call(array[i], i, array[i]) === false) break;
                }
            } else {
                for (k in array) {
                    if (callback.call(array[i], i, array[i]) === false) break;
                }
            }
            return array;
        },
        map: function (array, callback) {
            var i = 0,
                k,
                isArray = array.length >= 0,
                rect = [],
                result;
            if (isArray) {
                for (; i < array.length; i++) {
                    result = callback(array[i], i);
                    if (result != null) {
                        rect.push(rect);
                    }
                }
            } else {
                for (k in array) {
                    result = callback(array[k], k);
                    if (result != null) {
                        rect.push(result);
                    }
                }
            }
            return rect;
        }
    });

    //核心功能
    Quick.fn.extend({
        toArray: function () {
            return [].slice.call(this);
        },
        get: function (index) {
            if (index === undefined) {
                return this.toArray();
            }
            return this[index >= 0 ? index : this.length + index];
        },
        pushStack: function (ret) {
            //使用传入的数组创建Quick对象，并存储原始的Quick对象
            var newObj = Quick(ret);
            newObj.prevObj = this;
            return newObj;
        }
    });

    //
    //======DOM======操作模块
    //
    function parseHTML(str) {
        var div = document.createElement("div");  //
        div.innerHTML = str;
        var arr = [];
        for (var i = 0; i < div.childNodes.length; i++) {
            arr.push(div.childNodes[i]);
        }
        return arr;
    }

    //工具方法，仅仅是对DOM方法的扩展，所有的返回值是DOM对象
    Quick.extend({
        append: function (parentNode, childNode) {
        },
        insertBefore: function (parentNode, childNode, oldChildNode) {
        },
        insertAfter: function (parentNode, childNode, oldChildNode) {
        },
        next: function (node) {
            var tmpNode = node;
            while (tmpNode = tmpNode.nextSibling) {
                if (tmpNode.nodeType === 1) {
                    //return tmpNode;
                    break;
                }
            }
            return tmpNode;
        },
        nextAll: function (node) {
            var tmpNode = node,
                ret = [];
            while (tmpNode = tmpNode.nextSibling) {
                if (tmpNode.nodetype === 1) {
                    ret.push(tmpNode);
                }
            }
            return ret;
        },
        prev: function (node) {
            var tmpNode = node;
            while (tmpNode = tmpNode.previousSibling) {
                //返回dom元素的下一个 非文本节点l
                if (tmpNode.nodeType === 1) {
                    break;
                }
            }
            return tmpNode;
        },
        prevAll: function (node) {
            var tmpNode = node;
            var ret = [];
            while (tmpNode = tmpNode.previousSibling) {
                //返回dom元素的下一个 非文本节点l
                if (tmpNode.nodeType === 1) {
                    ret.push(tmpNode);
                }
            }
            return ret;
        }

    });

    Quick.fn.extend({
        appendTo: function (selector) {
            var iObj = Quick(selector),
                tmpObj,
                rect = [],
                i, j;
            //将this[i]添加到selector[j]上
            for (i = 0; i < this.length; i++) {
                for (j = 0; j < iObj.length; j++) {
                    tmpObj = j === iObj.length - 1 ? this[i] : this[i].cloneNode(true);
                    rect.push(tmpObj);
                    iObj[j].appendChild(tmpObj);
                }
            }
            //返回新对象，但必须存储旧对象
            return this.pushStark(rect);
        },
        append: function (selector) {
            Quick(selector).appendTo(this);
            return this;
        },
        prependTo: function (selector) {
            // 将参数 划归为 Itcast 对象, 那么任何参数都可以解决了
            var iObj = Quick(selector),
                tmpIObj,
                rect = [],
                i, j;
            for (i = 0; i < this.length; i++) {
                for (j = 0; j < iObj.length; j++) {
                    tmpIObj = j == iObj.length - 1 ? this[i] : this[i].cloneNode(true);
                    rect.push(tmpIObj);
                    // iObj[ j ].appendChild( tmpIObj );
                    iObj[j].insertBefore(tmpIObj, iObj[j].firstChild);
                }
            }
            return this.pushStack(rect);
        },
        prepend: function (selector) {
            Quick(selector).prependTo(this);
            return this;
        },
        next: function (selector) {
            return this.pushStark(this.map(function (v) {
                return Quick.next(v);
            }));
        },
        prev: function (selector) {
            return this.pushStark(this.map(function (v) {
                return Quick.prev(v);
            }));
        },
        nextAll: function () {

        },
        prevAll: function () {

        },
        siblings: function () {

        },
        remove:function () {
            this.each(function () {
                this.parentNode.removeChild(this);
            });
        }
    });

    
    //事件操作
    Quick.fn.extend({
       on:function (types, func) {
           return this.each(function(){
               var that = this;
               types.split(" ").forEach(function(v,i){
                    that.addEventListener(v,func)
               });
           });
       }
    });
Quick.each([
    "onabort", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange",
    "onclick", "onclose", "oncontextmenu", "oncuechange", "ondblclick", "ondrag",
    "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop",
    "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "oninput",
    "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata",
    "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave",
    "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onpause",
    "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize",
    "onscroll", "onseeked", "onseeking", "onselect", "onshow", "onstalled",
    "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange",
    "onwaiting", "onbeforecopy", "onbeforecut", "onbeforepaste", "oncopy",
    "oncut", "onpaste", "onsearch", "onselectstart", "onwheel", "onwebkitfullscreenchange",
    "onwebkitfullscreenerror"],function (i,v) {
        v = v.slice(2);
    Quick.fn[v] = function (eventFn) {
        return this.on(v,eventFn)
    }
});
    
    
//===== CSS =====
    Quick.fn.extend({
       css:function (name, value) {
           if( value === undefined ){     //只有一个参数
               if( typeof name ==="string"){      //返回数据
                   return this.get(0).style[name] || 
                           window.getComputedStyle( this.get(0))[name];
               }else{       //设置多个样式
                   return this.each(function () {
                       var that = this;
                       Quick.each(name,function (k,v) {
                           that.style[k] = v;
                       });
                   });
               }
           }else {              //两个参数
               return this.each(function () {
                   this.style[name] = value;
               });
           }
       },

        hasClass:function (className) {
            return this.toArray().some(function (v,i) {
                return v.className.split( ' ' ).indexOf( className ) >= 0
            });
        },
        
        addClass:function (className) {
            return this.each( function () {
                var classNameValues = this.className.trim().split( ' ' );

                if ( classNameValues.indexOf( className ) == -1 ) {
                    classNameValues.push( className );
                }

                this.className = classNameValues.join( ' ' );
            });
        },
        
        removeClass:function (className) {
            return this.each(function () {
                // 将 this 中的 类样式 className 去掉
                this.className = (' ' + this.className.replace( /\s/g, '  ' ) + ' ')
                    .replace( new RegExp( ' ' + className.trim() + ' ', 'g' ), ' ')
                    .trim();
            });
        },

        toggleClass: function ( className ) {
            if ( this.hasClass( className ) ) {
                this.removeClass( className );
            } else {
                this.addClass( className );
            }
            return this;
        }
        
    });
   
// ===== 属性操作  ======
    Quick.fn.extend({
        attr: function (name, value) {
            //传入，需要设
            if (value) {
                return this.each(function () {
                    this.setAttribute(name, value);
                });
            } else {
                //未传入，需要返回
                return this.get(0).getAttribute(name);
            }
        },
        prop: function (name, value) {
            if (value !== undefined) {
                return this.each(function () {
                    this[name] = value;
                });
            } else {
                return this.get(0)[name];
            }
        },
    });

    Quick.each({val: "value", html: "innerHTML", text: "innerText"}, function (k, v) {
        Quick.fn[k] = function (value) {

            if (value) {
                return this.each(function () {
                    this[v] = value;
                });
            } else {
                return this.get(0)[v];
            }
        }
    });

//====   其他全局数据与函数等 =====
    var loads = [];

    window.onload = function () {
        // 将数组中的 每一个 函数取出来执行
        Quick.each(loads, function (i, v) {
            this();
        });
    };

   
    window.Quick = window.Q = Quick;

})(window);