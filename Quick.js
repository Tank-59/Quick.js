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

    //事件操作....


    window.Quick = window.Q = Quick;

})(window);