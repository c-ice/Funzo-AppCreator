/**
 * Attribute is a Group rendered in Element its one row in Element
 */
(function() {
    
    AppCreator.Attribute = function(config) {
        this._initAttribute(config);
    };
    
    AppCreator.Attribute.prototype = {
        _initAttribute: function(config) {
            this.attributesDrawHeight = 19;
            this.attributesPadding = 2;
            this._name = config.name;
            this._type = config.type;
            

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
            
            this.refreshText();
                
            this.add(this._line);
            this.add(this._text);
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
                points[1].x = newWidth;
            }
            if (newHeight) {
                this.setHeight(newHeight);
                this._text.setHeight(newHeight);
                points[1].y = newHeight;
                points[0].y = newHeight;
            }
            
            this._line.setPoints(points);
        }
    }
    
    Kinetic.Global.extend(AppCreator.Attribute, Kinetic.Group);
})();