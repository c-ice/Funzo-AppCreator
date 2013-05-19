(function() {
    AppCreator.CFG.Property = function(config) {
        return this._initProperty(config);
    };


    /**
     * Hold propertie value, name and other props
     * automatic oneWay binding from UI to value with change event
     */
    AppCreator.CFG.Property.prototype = {
        _initProperty: function(config) {
            if (this.attrs === undefined) {
                this.attrs = {};
            }

            this.setInputType(config.inputType || "text");
            this.setName(config.name || "");
            this.setDisplayName(config.displayName || this.getName());
            this.setValue(config.value || "");
            this.setTypeLimitation(config.typeLimitation || "all");
            this.setValues(config.values || []);
        },
        getDOM: function(where) {
            // TODO: BUG is here missing events after remove from document 
            // workaround still creating new dom
//            if (!this._dom) {
            var self = this, dom = $('<div/>', {
                'class': "controls controls-row"
            }), input = null;

            dom.append($('<label/>', {
                "class": "control-label",
                text: self.getDisplayName()
            }));

            if (self.getInputType() !== 'combobox') {
                input = $('<input/>', {
                    name: self.getName(),
                    type: self.getInputType(),
                    placeholder: self.getDisplayName(),
                    value: self.getValue(),
                    autocomplete: 'off'
                });

                if (self.getName() === 'type') {
                    AppCreator.CFG.typeahead(input);
                }

                input.change(function() {
                    // is Valid
                    if (self.validationFunc()) {
                        self.setValue($(this).val());
                        AppCreator.Attribute.selectedAttribute.refreshText();
                        AppCreator.Attribute.selectedAttribute.draw();
                    }
                });

                if (self.getInputType() === 'checkbox' && self.getValue() === true) {
                    input.attr('checked', 'checked');
                }

                dom.append(input);
            } else {
                var select = $('<select/>', {
                    name: self.getName()
                }), i = 0, values = self.getValues();

                if (Kinetic.Type._isArray(values)) {
                    for (i = 0; i < values.length; i++) {
                        select.append($("<option/>", {
                            value: values[i].val,
                            text: values[i].text
                        }));
                    }
                }

                select.change(function() {
                    if (self.validationFunc()) {
                        self.setValue($(this).val());
                        AppCreator.Attribute.selectedAttribute.refreshText();
                        AppCreator.Attribute.selectedAttribute.draw();
                    }
                });

                dom.append(select);
            }

            if (where) {
                $(where).append(dom);
            }

            return dom;
//            }
//
//            return this._dom;
        },
        validationFunc: function() {
            return this.getValue() !== "" && this.getValue() !== null;
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
     * Value of propertie
     * if (inputType == combobox) {
     *      value is Array of objects like this {val: 'value', text:"diplayText"}; 
     * }
     * @name setValue
     * @methodOf AppCreator.CFG.Property.prototype
     */
    AppCreator.GO.addGettersSetters(AppCreator.CFG.Property,
            ['inputType', 'name', 'displayName', 'value', 'values', 'typeLimitation', 'attributeID']);

    AppCreator.CFG.attributeProperties = {};
    AppCreator.CFG.attributeProperties.model = function() {
        var model = {};
        model['name'] = (new AppCreator.CFG.Property({
            name: 'name',
            displayName: 'Name',
            inputType: 'text'
        }));
        model['type'] = (new AppCreator.CFG.Property({
            name: 'type',
            displayName: 'Type',
            inputType: 'text'
        }));
        model['scope'] = (new AppCreator.CFG.Property({
            name: 'scope',
            displayName: 'Scope',
            inputType: 'combobox',
            values: [
                {'val': 'private', 'text': 'Private'},
                {'val': 'public', 'text': 'Public'},
                {'val': 'protected', 'text': 'Protected'},
                {'val': 'default', 'text': 'Default'}
            ]
        }));
        model['static'] = (new AppCreator.CFG.Property({
            name: 'static',
            displayName: 'Is Static',
            inputType: 'checkbox'
        }));
        model['presistency'] = (new AppCreator.CFG.Property({
            name: 'presistency',
            displayName: 'Persistency',
            inputType: 'combobox',
            values: [
                {'val': 'persistent', 'text': 'Persistent'},
                {'val': 'local', 'text': 'Not Persistent'},
                {'val': 'generated', 'text': 'Generated'},
                {'val': 'dbgenerated', 'text': 'Generated by database'}
            ]
        }));
        model['access'] = (new AppCreator.CFG.Property({
            name: 'access',
            displayName: 'Access',
            inputType: 'combobox',
            values: [
                {'val': 'read', 'text': 'Read'},
                {'val': 'write', 'text': 'Write'},
                {'val': 'full', 'text': 'Read & Write'}
            ]
        }));
        model['visibility'] = (new AppCreator.CFG.Property({
            name: 'visibility',
            displayName: 'Is Visible',
            inputType: 'checkbox',
            value: true
        }));
        model['unique'] = (new AppCreator.CFG.Property({
            name: 'unique',
            displayName: 'Is Unique',
            inputType: 'checkbox'
        }));

        return model;
    };
    AppCreator.CFG.attributeProperties.view = function() {
        var view = {};
        view['name'] = (new AppCreator.CFG.Property({
            name: 'name',
            displayName: 'Name',
            inputType: 'text'
        }));
        view['type'] = (new AppCreator.CFG.Property({
            name: 'type',
            displayName: 'Type',
            inputType: 'text'
        }));

        return view;
    };
    AppCreator.CFG.attributeProperties.router = function() {
        var router = {};
        
        router['name'] = (new AppCreator.CFG.Property({
            name: 'name',
            displayName: 'Name',
            inputType: 'text'
        }));
        router['type'] = (new AppCreator.CFG.Property({
            name: 'type',
            displayName: 'Type',
            inputType: 'text'
        }));
        
        return router;
    };
})();