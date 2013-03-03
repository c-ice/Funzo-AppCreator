
(function() {

    AppCreator.Element = function(config) {
        this._initElement(config);
    };

    AppCreator.Element.prototype = {
        _initElement: function(config) {
            this.attributesDrawHeight = 19;
            this._title = null;
            this._attributes = {
                length: 0
            };
            this._assocObjects = [];
            this.attributesPadding = 2;
            this._isSelected = false;
            this._resizePoints = [];
            this._minSize = {
                width: 100,
                height: this.attributesDrawHeight
            };

            // call super constructor
            Kinetic.Group.call(this, config);
            this.ACType = 'Element';

            this._border = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: this.getWidth(),
                height: this.getHeight(),
                fill: 'white',
                stroke: 'black',
                strokeWidth: 1,
                shadowColor: 'black',
                shadowBlur: 15,
                shadowOffset: 0,
                shadowOpacity: 0.6,
                shadowEnabled: false
            });
            this.add(this._border);

            this._renderTitle(false);
            this.on('click', function() {
                this.setSelected(true);
            });
            
            this.on('dragstart', function(e) {
                e.preventDefault();
                AppCreator.setCursorTo('move');
            });
            
            this.on('dragend', function(e) {
                //e.preventDefault();
                AppCreator.defaultCursor();
            });

            this.on('dragmove', function() {
                var newX = Math.floor(this.getX() / AppCreator.gridSize) * AppCreator.gridSize,
                newY = Math.floor(this.getY() / AppCreator.gridSize) * AppCreator.gridSize;
                this.setX(newX);
                this.setY(newY);
            });
        },
        getMinSize: function() {
            return this._minSize;
        },
        _renderAddAttrButton: function(){
            var btn = null, self = this;
            
            
            
            
            return btn;
        },
        _renderTitle: function(exists) {
            if (exists) {
                var titles = this.get('#title');

                if (titles.length > 0) {
                    titles[0].setText(this.title());
                }
            } else {
                this._title = new AppCreator.Attribute({
                    x: 0,
                    y: 0,
                    width: this.getWidth(),
                    name: "",
                    type: ""
                });

                this._title.setKineticText(new Kinetic.Text({
                    id: 'title',
                    x: this.attributesPadding,
                    y: this.attributesPadding,
                    text: "<< Title >>",
                    fontSize: 13,
                    fontFamily: 'Calibri',
                    fill: 'black',
                    align: 'center',
                    width: this.getMinSize().width
                }));

                this.resizeWithNewMinWidth(this._title.getWidth());

                this.add(this._title);
            }
        },
        title: function(title) {
            if (typeof title === 'string') {
                this._title.setText(title);
            }

            return this._title.getText();
        },
        _createResizePoints: function() {
            if (!this._resizePoints ||
                    this._resizePoints.length < 4) {
                this._resizePoints.push(
                        new AppCreator.ResizePoint({
                    type: AppCreator.ResizePoint.Type.NorthWest,
                    target: this,
                    draggable: true
                }),
                new AppCreator.ResizePoint({
                    type: AppCreator.ResizePoint.Type.NorthEast,
                    target: this,
                    draggable: true
                }),
                new AppCreator.ResizePoint({
                    type: AppCreator.ResizePoint.Type.SouthEast,
                    target: this,
                    draggable: true
                }),
                new AppCreator.ResizePoint({
                    type: AppCreator.ResizePoint.Type.SouthWest,
                    target: this,
                    draggable: true
                }));

                for (var i in this._resizePoints) {
                    this.getParent().add(this._resizePoints[i]);
                }
            }
        },
        setSelected: function(selected) {
            if (selected && !this._isSelected) {
                this._createResizePoints();

                for (var i in this._resizePoints) {
                    this._resizePoints[i].show();
                }

                this._border.setShadowEnabled(true);
                this.getParent().draw();
            }

            if (!selected && this._isSelected) {
                for (var i in this._resizePoints) {
                    this._resizePoints[i].hide();
                }
                this._border.setShadowEnabled(false);
                this.getParent().draw();
            }

            this._isSelected = selected;
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

                this._minSize.height = (attr.getY() + attr.getHeight()) + this.attributesDrawHeight;

                this.resizeWithNewMinWidth(attr.getWidth());

                this.add(attr);
                this._attributes.length++;
                this._attributes[attribute.name] = {
                    type: attribute.type,
                    canvasId: attr._id
                };
            } else {
                if (this._attributes[attribute.name].type !== attribute.type) {
                    this._attributes[attribute.name].type = attribute.type;
                    for (var i in this.getChildren()) {
                        if (this.getChildren()[i]._id === this._attributes[attribute.name].canvasId) {
                            this.getChildren()[i].setType(attribute.type);
                            this.resizeWithNewMinWidth(this.getChildren()[i].getWidth());
                            break;
                        }
                    }
                }
            }

            this.draw();
        },
        resizeToNewSize: function(newWidth, newHeight) {
            if (newWidth) {
                this.setWidth(newWidth);
            }
            if (newHeight)
                this.setHeight(newHeight);

            for (var i = 0; i < this.getChildren().length; i++) {
                var child = this.getChildren()[i];
                if (child.ACType === 'Attribute') {
                    child.resizeToNewSize(newWidth);
                }
                else if (child.nodeType === 'Shape' && child.shapeType === 'Line') {
                    var points = child.getPoints();
                    points[1].x = (newWidth ? newWidth : points[1].x);
                    child.setPoints(points);
                } else {
                    child.setWidth(newWidth);
                    child.setHeight(newHeight);
                }
            }

            this.fire('resize');
        },
        resizeWithNewMinWidth: function(newMinWidth) {
            var calculated = newMinWidth;
            if (this.getWidth() < newMinWidth) {
                this.setWidth(calculated);
                this._minSize.width = newMinWidth;

                for (var i = 0; i < this.getChildren().length; i++) {
                    var child = this.getChildren()[i];
                    if (child.ACType === 'Attribute') {
                        child.resizeWithNewMinWidth(calculated);
                    }
                    else if (child.nodeType === 'Shape' && child.shapeType === 'Line') {
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