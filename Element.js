var AppCreator = {};
(function() {
    
    AppCreator.Element = function(config) {
        this._initElement(config);
    };
    
    AppCreator.Element.prototype = {
        _initElement: function(config) {
            this.attributesDrawHeight = 19;
            this._title = "<< Title >>";
            this._attributes = {
                length:0
            };
            this.attributesPadding = 2;

            // call super constructor
            Kinetic.Group.call(this, config);
            this.nodeType = 'Element';
            
            this.add(new Kinetic.Rect({
                x: 0,
                y: 0,
                width: 150,
                height: 200,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 1
            }));
            
            this._renderTitle(false);
        },
        
        _renderTitle: function(exists) {
            if (exists) {
                var titles = this.get('#title');
            
                if (titles.length > 0) {
                    titles[0].setText(this.title());
                }
            } else {
                var attr = new AppCreator.Attribute({
                    x: 0,
                    y: 0,
                    width: this.getWidth(),
                    name: "",
                    type: ""
                });

                attr.setKineticText(new Kinetic.Text({
                    id: 'title',
                    x: this.attributesPadding,
                    y: this.attributesPadding,
                    text: this.title(),
                    fontSize: 13,
                    fontFamily: 'Calibri',
                    textFill: 'black',
                    align: 'center', 
                    width: 150
                }));

                this.resizeWithNewMinWidth(attr.getWidth());

                this.add(attr);
            }
        },
        
        title: function(title) {
            if (typeof title === 'string') {
                this._title = title;
            } 
            
            return this._title;
        }, 
        
        addAttribute: function(attribute) {
            if (typeof this._attributes[attribute.name] === 'undefined') {
                var attr = new AppCreator.Attribute({
                    x: 0,
                    y: (this._attributes.length ? this._attributes.length + 1 : 1) * this.attributesDrawHeight,
                    width: this.getWidth(),
                    name: attribute.name,
                    type: attribute.type
                });

                this.resizeWithNewMinWidth(attr.getWidth());

                this.add(attr);
                this._attributes.length++;
                this._attributes[attribute.name] = {
                    type: attribute.type,
                    canvasId: attr._id
                };
            } else {
                if (this._attributes[attribute.name].type != attribute.type) {
                    this._attributes[attribute.name].type = attribute.type;
                    for (var i in this.getChildren()) {
                        if (this.getChildren()[i]._id == this._attributes[attribute.name].canvasId) {
                            this.getChildren()[i].setType(attribute.type);
                            this.resizeWithNewMinWidth(this.getChildren()[i].getWidth());
                            break;
                        }
                    }
                }
            }
            
            this.draw();
        },
        
        resizeWithNewMinWidth: function(newMinWidth) {
            var calculated = newMinWidth;
            if (this.getWidth() < newMinWidth) {                
                this.setWidth(calculated);
            
                for(var i = 0; i < this.getChildren().length; i++) {
                    var child = this.getChildren()[i];
                    if (child.nodeType == 'Attribute') {
                        child.resizeWithNewMinWidth(calculated);
                    }
                    else if (child.nodeType == 'Shape' && child.shapeType == 'Line') {
                        var points = child.getPoints();
                        points[1].x = calculated;
                        child.setPoints(points);
                    } else {
                        child.setWidth(calculated);
                    }
                }
            }
            
            return calculated;
        }
    }
    
    Kinetic.Global.extend(AppCreator.Element, Kinetic.Group);
})();