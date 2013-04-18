
(function() {

    AppCreator.Element = function(config) {
        this._initElement(config);
    };

    AppCreator.Element.prototype = {
        _initElement: function(config) {
            var self = this;
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
            this._addAttrButton = null;
            this._addAttrDialogs = [];
            this._titleDialog = null;

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
                shadowoffset: [0, 0],
                shadowOpacity: 0.6
            });
            this._border.setShadowEnabled(false);

            this.add(this._border);

            this._renderTitle(false);
            self.on('click', function(evt) {
                if (AppCreator.selectedTool === AppCreator.tools.Mouse) {
                    AppCreator.clickedElement = this;
                    setTimeout(function() {
                        self.setSelected(true);
                    }, 100);
                }
            });

            this.on('dragstart', function(e) {
                e.preventDefault();
                AppCreator.GO.resetSelection(this);
                AppCreator.setCursorTo('move');
            });

            this.on('dragend', function(e) {
                //e.preventDefault();
                AppCreator.defaultCursor();
            });

            this._renderAddAttrButton();

            this.on('dragmove', function() {
                var newX = Math.floor(this.getX() / AppCreator.gridSize) * AppCreator.gridSize,
                        newY = Math.floor(this.getY() / AppCreator.gridSize) * AppCreator.gridSize;
                this.setX(newX);
                this.setY(newY);
            });
        },
        afterInit: function() {
            for (var i in AppCreator.CFG.presettedAttributes) {
                this.addAttribute(AppCreator.CFG.presettedAttributes[i]);
            }
        },
        _repositionAddAttrDialogs: function() {
            var self = this, i = 0, len = self._addAttrDialogs.length;
            if (len > 0) {
                for (; i < len; i++) {
                    self._addAttrDialogs[i].setY(self.getAbsolutePosition().y + self._newAttributeY() + i * 22);
                }

                var maxPos = self._addAttrDialogs[len - 1].getY() + self._addAttrDialogs[len - 1].getHeight();
                if (self.getHeight() + self.getY() < maxPos) {
                    self.resizeToNewSize(self.getWidth(), maxPos - self.getY());
                }
            }
        },
        getMinSize: function() {
            return this._minSize;
        },
        _renderAddAttrButton: function() {
            var self = this, image = AppCreator.Images.getImage("plusButton"),
                    btn = new Kinetic.Image({
                'x': self.getWidth() / 2 - 13,
                'y': self.getHeight() - 6,
                'width': 26,
                'height': 26,
                'opacity': 0.5,
                'scale': 0.9
            });

            btn.on('mouseenter', function() {
                this.move([0, 3]);
                this.setOpacity(1);
                self.getParent().draw();
            });
            btn.on('mouseout', function() {

                this.move([0, -3]);
                this.setOpacity(0.5);
                self.getParent().draw();
            });

            btn.on('click', function() {
                // TODO: resize
                var dlg = new AppCreator.Dialogs.SimpleDialog({
                    y: self.getAbsolutePosition().y + self._newAttributeY() + self._addAttrDialogs.length * 22,
                    x: self.getAbsolutePosition().x,
                    width: self.getWidth()
                });

                self._addAttrDialogs.push(dlg);
                self._repositionAddAttrDialogs();

                dlg.submit = function(el) {
                    self.addAttribute($(el).serializeObject());
                    for (var i in self._addAttrDialogs) {
                        if (self._addAttrDialogs[i] === dlg) {
                            self._addAttrDialogs.splice(i, 1);
                            if (self._addAttrDialogs.length > 0) {
                                self._addAttrDialogs[(self._addAttrDialogs.length > i) ? i : self._addAttrDialogs.length - 1].focus();
                            }
                            break;
                        }
                    }
                    self._repositionAddAttrDialogs();
                    dlg.remove();

                    self.setDraggable(true);
                };
                dlg.cancel = function() {
                    for (var i in self._addAttrDialogs) {
                        if (self._addAttrDialogs[i] === dlg) {
                            self._addAttrDialogs.splice(i, 1);
                            if (self._addAttrDialogs.length > 0) {
                                self._addAttrDialogs[(self._addAttrDialogs.length > i) ? i : self._addAttrDialogs.length - 1].focus();
                            }
                            break;
                        }
                    }
                    self._repositionAddAttrDialogs();
                    dlg.remove();
                    self.setDraggable(true);
                };

                self.setDraggable(false);
            });

            self.add(btn);
            self._addAttrButton = btn;
            self.on('resize', function(deltaSize) {
                btn.move({
                    x: deltaSize.width / 2,
                    y: deltaSize.height
                });
            });

            if (!image.complete) {
                image.addEventListener('load', function() {
                    btn.setImage(image);
                    self.getParent().draw();
                });
            } else {
                btn.setImage(image);
            }
        },
        _renderTitle: function(exists) {
            if (exists) {
                var titles = this.get('#title');
                if (titles.length > 0) {
                    titles[0].setText(this.title());
                }
            } else {
                var self = this;
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

                this._title.on('dblclick', function() {
                    self._titleDialog = new AppCreator.Dialogs.TitleDialog({
                        y: self.getAbsolutePosition().y,
                        x: self.getAbsolutePosition().x,
                        width: self.getWidth(),
                        title: self.title()
                    });

                    self.setDraggable(false);
                    self._titleDialog.submit = function(el) {
                        // ak sa nachadza tak neprida
                        if (AppCreator.models.indexOf($(el).serializeObject().name) !== -1 &&
                                $(el).serializeObject().name !== self.title()) {
                            $(el).popover('show');
                            return false;
                        }
                        $(el).popover('destroy');
                        self.title($(el).serializeObject().name);
                        self._titleDialog.remove();
                        self._titleDialog = null;
                        self.setDraggable(true);
                        self.getLayer().draw();
                    };

                    self._titleDialog.cancel = function() {
                        self._titleDialog.remove();
                        self._titleDialog = null;
                        self.setDraggable(true);
                    };
                });

                this.add(this._title);
            }
        },
        title: function(title) {
            if (typeof title === 'string') {
                var old = this._title.getKineticText().getText(),
                        index = AppCreator.models.indexOf(old);

                if (index === -1) {
                    AppCreator.models.push(title);
                } else {
                    AppCreator.models[index] = title;
                }

                this._title.getKineticText().setText(title);

                this.fire('titlechanged', {
                    oldValue: old,
                    newValue: title
                });
            }

            return this._title.getKineticText().getText();
        },
        _createResizePoints: function() {
            if (!this._resizePoints ||
                    this._resizePoints.length < 4) {
                var zIndex = this.getZIndex();
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
                    this._resizePoints[i].setZIndex(zIndex);
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
                this.fire('dragmove');
            }

            if (!selected && this._isSelected) {
                for (var i in this._resizePoints) {
                    this._resizePoints[i].hide();
                }
                this._border.setShadowEnabled(false);
                this.fire('dragmove');
            }

            this.getLayer().draw();
            this._isSelected = selected;
        },
        _newAttributeY: function() {
            return (this._attributes.length ? this._attributes.length + 1 : 1) * this.attributesDrawHeight;
        },
        addAttribute: function(attribute) {
            var attr = null;
            if (typeof this._attributes[attribute.name] === 'undefined') {
                attr = new AppCreator.Attribute({
                    x: 0,
                    y: this._newAttributeY(),
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

            this.getLayer().draw();

            return attr || this._attributes[attribute.name];
        },
        resizeToNewSize: function(newWidth, newHeight) {
            var delta = {width: 0, height: 0};
            if (newWidth) {
                delta.width = newWidth - this.getWidth();
                this.setWidth(newWidth);
            }
            if (newHeight) {
                delta.height = newHeight - this.getHeight();
                this.setHeight(newHeight);
            }

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
                    if (child.nodeType === 'Shape' && child.shapeType === 'Image') {
                        // nothing
                    } else {
                        child.setWidth(newWidth);
                        child.setHeight(newHeight);
                    }
                }
            }

            this.fire('resize', delta);
        },
        resizeWithNewMinWidth: function(newMinWidth) {
            var calculated = newMinWidth, delta = this.getWidth(),
                    dHeight = this._minSize.height - this.getHeight();
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
                        if (child.nodeType === 'Shape' && child.shapeType === 'Image') {
                            // nothing
                        } else {
                            child.setWidth(calculated);
                        }
                    }
                }
            }

            if (dHeight > 0) {
                this.setHeight(this._minSize.height);
                this._border.setHeight(this._minSize.height);
            }

            this.fire('resize', {
                width: newMinWidth - delta,
                height: dHeight > 0 ? dHeight : 0
            });

            return calculated;
        },
        setDraggable: function(draggable) {
            if (draggable && this.canBeDragged() || !draggable) {
                //Node.setDraggable
                this.setAttr('draggable', draggable);
                this._dragChange();
            }
            //channailing
            return this;
        },
        canBeDragged: function() {
            if (this._addAttrDialogs.length > 0 ||
                    this._titleDialog !== null || this.getNotDraggable()) {
                return false;
            }

            return true;
        },
        /**
         * Override Kinetic.Node.prototype.remove
         * @returns {undefined}
         */
        remove: function() {
            for (var i in this._resizePoints) {
                this._resizePoints[i].remove();
            }
            
            Kinetic.Node.prototype.remove.call(this);

        }
    };

    Kinetic.Global.extend(AppCreator.Element, Kinetic.Group);

    // another reasons  why cant be element dragged
    Kinetic.Node.addGetterSetter(AppCreator.Element, 'notDraggable', false);
})();