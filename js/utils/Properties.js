(function() {
    AppCreator.CFG.Property = function(config) {
        return this._initProperty(config);
    };

    AppCreator.CFG.Property.prototype = {
        _initProperty: function(config) {
            if (this.attrs === undefined) {
                this.attrs = {};
            }

            this.setInputType(config.inputType || "text");
            this.setName(config.name || "");
            this.setDisplayName(config.displayName || this.getName());
            this.setValidationFunc(config.validationFunc || function() {
                return true;
            });
            this.setValue(config.value || "");


        },
        getDOM: function(where) {
            if (!this._dom) {
                var self = this, dom = $('<div/>', {
                    'class': "controls controls-row"
                }), input = null;

                dom.append($('<label/>', {
                    "class": "control-label",
                    text: self.getDisplayName()
                }));

                if (self.getInputType() !== 'combobox') {
                    // TODO: add typehead function and attrs for holding array
                    input = $('<input/>', {
                        name: self.getName(),
                        type: self.getInputType(),
                        placeholder: self.getDisplayName(),
                        value: self.getValue()
                    });
                    
                    if (self.getInputType() === 'checkbox' && self.getValue() === true) {
                        input.attr('checked', 'checked');
                    }
                    
                    dom.append();
                } else {
                    var select = $('<select/>', {
                        name: self.getName()
                    }), i = 0, values = self.getValue();

                    if (Kinetic.Type._isArray(values)) {
                        for (i = 0; i < values.length; i++) {
                            select.append($("<option/>", {
                                value: values[i].val,
                                text: values[i].text
                            }));
                        }
                    }

                    dom.append(select);
                }

                if (where) {
                    $(where).append(dom);
                }

                this._dom = dom;
            }

            return this._dom;
        }
    };

    /**
     * set type of input element
     * @name setInputType
     * @param {String} value 'combobox'|'checkbox'|'number'|'text'|'color'|'datetime'...
     * @methodOf AppCreator.CFG.Property.prototype
     */
    /**
     * internal name
     * @name setName
     * @methodOf AppCreator.CFG.Property.prototype
     */
    /**
     * Name that display in UI
     * @name setDisplayName
     * @methodOf AppCreator.CFG.Property.prototype
     */
    /**
     * function that validate user setted values, 
     * @name setValidationFunc
     * @return {Boolean} true of valid else false
     * @methodOf AppCreator.CFG.Property.prototype
     */
    /**
     * Value of propertie
     * if (inputType == combobox) {
     *      value is Array of objects like this {val: 'value', text:"diplayText"}; 
     * }
     * @name setValue
     * @methodOf AppCreator.CFG.Property.prototype
     */
    AppCreator.GO.addGettersSetters(AppCreator.CFG.Property,
            ['inputType', 'name', 'displayName', 'validationFunc', 'value', 'typelimitation']);

    AppCreator.CFG.propertiesForAttributeByModelType = {
        model: [],
        view: [],
        router: []
    };
    
    //----------- push default properties
    (function(){
        // reference to array
        var model = AppCreator.CFG.propertiesForAttributeByModelType.model;
        model.push(new AppCreator.CFG.Property({
            name: 'name',
            displayName: 'Name',
            inputType: 'text'
        }));
        model.push(new AppCreator.CFG.Property({
            name: 'type',
            displayName: 'Type',
            inputType: 'text'
        }));
        model.push(new AppCreator.CFG.Property({
            name: 'scope',
            displayName: 'Scope',
            inputType: 'combobox',
            value: [
                {'val':'private', 'text':'Private'},
                {'val':'public', 'text':'Public'},
                {'val':'protected', 'text':'Protected'},
                {'val':'default', 'text':'Default'}
            ]
        }));
        model.push(new AppCreator.CFG.Property({
            name: 'static',
            displayName: 'Is Static',
            inputType: 'checkbox'
        }));
        model.push(new AppCreator.CFG.Property({
            name: 'presistency',
            displayName: 'Persistency',
            inputType: 'combobox',
            value: [
                {'val':'persistent', 'text':'Persistent'},
                {'val':'local', 'text':'Not Persistent'},
                {'val':'generated', 'text':'Generated'},
                {'val':'dbgenerated', 'text':'Generated by database'}
            ]
        }));
        model.push(new AppCreator.CFG.Property({
            name: 'access',
            displayName: 'Access',
            inputType: 'combobox',
            value: [
                {'val':'read', 'text':'Read'},
                {'val':'write', 'text':'Write'},
                {'val':'full', 'text':'Read & Write'}
            ]
        }));
        model.push(new AppCreator.CFG.Property({
            name: 'visibility',
            displayName: 'Is Visible',
            inputType: 'checkbox',
            value: true
        }));
        model.push(new AppCreator.CFG.Property({
            name: 'unique',
            displayName: 'Is Unique',
            inputType: 'checkbox'
        }));
    })();
})();