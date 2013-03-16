/* 
 * helper class
 * 
 */
(function() {
    AppCreator.Globals = {
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
            AppCreator.Globals.addSetters(constructor, arr);
            AppCreator.Globals.addGetters(constructor, arr);
        }
    }

})();


