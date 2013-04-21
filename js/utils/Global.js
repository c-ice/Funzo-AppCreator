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
         * recursivly finding parent with specified type or 
         * if not found then null
         * @param {Object|Element|Attribute} obj
         * @param {String|null} actype
         * @returns {Element}
         */
        findAppCreatorParent: function(obj, actype) {
            // ak som trafil objekt s ACType skontrolujem ci to nieje to co hladam
            if (obj && obj.ACType) {
                if (actype && obj.ACType === actype || !actype) {
                    return obj;
                }
            }

            if (obj && obj.getParent) {
                return this.findAppCreatorParent(obj.getParent(), actype);
            } else {
                return null;
            }
        },
        resetSelection: function(except) {
            var childs = AppCreator.instance._layer.getChildren(), i, child;
            for (i in childs) {
                child = childs[i];
                if (child.ACType === 'Element') {
                    if (except !== childs[i])
                        child.setSelected(false);
                    else
                        child.setSelected(true);
                }
            }
            
            if (AppCreator.Attribute.selectedAttribute && 
                    AppCreator.Attribute.selectedAttribute.getParent() !== except) 
            {
                AppCreator.Attribute.selectedAttribute.setSelected(false);
                AppCreator.Attribute.selectedAttribute.getParent().draw();
                AppCreator.Attribute.selectedAttribute = null;
            }
        }
    };

})();


