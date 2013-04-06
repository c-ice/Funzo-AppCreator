/* 
 * helper class
 * 
 */
(function() {
    AppCreator.GO = {
        addGetters: function(constructor, arr) {
            var len = arr.length;
            for (var n = 0; n < len; n++) {
                var attr = arr[n];
                this._addGetter(constructor, attr);
            }
        },
        _addGetter: function(constructor, attr) {
            var method = 'get' + attr.charAt(0).toUpperCase() + attr.slice(1);
            constructor.prototype[method] = function(arg) {
                return this.attrs[attr];
            };
        },
        addSetters: function(constructor, arr) {
            var len = arr.length;
            for (var n = 0; n < len; n++) {
                var attr = arr[n];
                this._addSetter(constructor, attr);
            }
        },
        _addSetter: function(constructor, attr) {
            var method = 'set' + attr.charAt(0).toUpperCase() + attr.slice(1);
            constructor.prototype[method] = function(val) {
                this.attrs[attr] = val;
                if (Kinetic.Type._isFunction(this._draw)) {
                    this._draw();
                }
            };
        },
        addGettersSetters: function(constructor, arr) {
            AppCreator.GO.addSetters(constructor, arr);
            AppCreator.GO.addGetters(constructor, arr);
        },
        /**
         * recursivly finding parent with specified type
         * @param {type} obj
         * @param {type} actype
         * @returns {@exp;obj@call;getParent}
         */
        findAppCreatorParent: function(obj, actype) {
            if (obj.getParent && obj.getParent().ACType) {
                // ak sa typ zhoduje alebo nieje zadany hladany typ
                if (actype && actype === obj.getParent().ACType ||
                        !actype) {
                    return obj.getParent();
                }
            } else if (!obj.getParent) {
                return null;
            } else {
                return this.findAppCreatorParent(obj.getParent(), actype);
            }
        }
    };

})();


