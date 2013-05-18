/**
 * Attribute is a Group rendered in Element its one row in Element
 */
(function() {

    AppCreator.Attribute = function(config) {
        this._initAttribute(config);
    };

    AppCreator.Attribute.selectedAttribute = null;

    AppCreator.Attribute.prototype = {
        _initAttribute: function(config) {
            this.attributesDrawHeight = 19;
            this.attributesPadding = 2;
            this._name = config.name;
            this._type = config.type;

            this.properties = {
                type: config.type||"",
                name: config.name||""
            };

            // call super constructor
            Kinetic.Group.call(this, config);
            this.ACType = 'Attribute';

            this._text = new Kinetic.Text({
                x: this.attributesPadding,
                y: this.attributesPadding,
                text: "",
                fontSize: 13,
                fontFamily: 'Calibri',
                fill: 'black'
            });

            this._line = new Kinetic.Line({
                points: [0, this.attributesDrawHeight, this.getWidth(), this.attributesDrawHeight],
                stroke: 'black',
                strokeWidth: 1
            });

            this._rect = new Kinetic.Rect({
                x: 1,
                y: 0,
                height: this.attributesDrawHeight,
                width: this.getWidth()-2,
                fill:'#0088cc',
                fillEnabled: false
            });

            this.refreshText();

            this.add(this._rect);
            this.add(this._line);
            this.add(this._text);

            this.on('click.attr', function(e) {
                if (this.getCanSelect()) {
                    this.setSelected(true);
                    if (AppCreator.Attribute.selectedAttribute !== null) {
                        AppCreator.Attribute.selectedAttribute.setSelected(false);
                    }

                    AppCreator.Attribute.selectedAttribute = this;
                }
            });
        },
        setSelected: function(select) {
            if (select && !this.getSelected()) {
                this._rect.setFillEnabled(true);
                this._text.setFill('white');
                this.attrs['selected'] = true;
                $(document).trigger('attributeSelected', {attr: this});
            } else if (!select && this.getSelected()) {
                this._rect.setFillEnabled(false);
                this._text.setFill('black');
                this.attrs['selected'] = false;
            }

            return this;
        },
        setText: function(name, type) {
            if (type) {
                this._type = type;
            }
            if (name) {
                this._name = name;
            }
            if (this._text) {
                this._text.setText("+" + this._name + " : " + this._type);

                if (this._text.getTextWidth() > this.getWidth()) {
                    this.resizeWithNewMinWidth(this._text.getTextWidth() + 2 * this.attributesPadding);
                }
            }
        },
        refreshText: function() {
            this.setText(this._name, this._type);
        },
        setType: function(type) {
            this._type = type;
            this.refreshText();
        },
        getKineticText: function() {
            return this._text;
        },
        setKineticText: function(text) {
            this._text.remove();
            this._text = text;
            this.add(this._text);
        },
        resizeWithNewMinWidth: function(newMinWidth) {
            var calculated = newMinWidth;
            if (this.getWidth() < newMinWidth) {
                this.setWidth(calculated);
                this._rect.setWidth(calculated-2);
                this._text.setWidth(calculated);
                var points = this._line.getPoints();
                points[1].x = calculated;
                this._line.setPoints(points);
            }

            return calculated;
        },
        resizeToNewSize: function(newWidth, newHeight) {
            var points = this._line.getPoints();
            if (newWidth) {
                this.setWidth(newWidth);
                this._text.setWidth(newWidth);
                this._rect.setWidth(newWidth-2);
                points[1].x = newWidth;
            }
            if (newHeight) {
                this.setHeight(newHeight);
                this._text.setHeight(newHeight);
                this._rect.setHeight(newHeight);
                points[1].y = newHeight;
                points[0].y = newHeight;
            }

            this._line.setPoints(points);
        }
    };

    Kinetic.Node.addGetter(AppCreator.Attribute, 'selected', false);
    Kinetic.Node.addGetterSetter(AppCreator.Attribute, 'canSelect', true);
    Kinetic.Global.extend(AppCreator.Attribute, Kinetic.Group);
})();