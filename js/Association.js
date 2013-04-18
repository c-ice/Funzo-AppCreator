(function() {

    AppCreator.Association = function(config) {
        this._initAssociation(config);
    };
    AppCreator.Association.prototype = {
        _initAssociation: function(config) {
            var self = this;
            this.createAttrs();
            this.attrs.points = [];
            this._target = null;
            this._source = null;
            this._sourceNameText = null;
            this._sourceCountingText = null;
            this._targetNameText = null;
            this._targetCountingText = null;
            Kinetic.Line.call(this, config);
            this.attrs.stroke = 'black';
            this.attrs.strokeWidth = 1;
            this.ACType = 'Association';
            self.on('mousedown', function(e) {
                var point = self.addMovePoint([e.layerX, e.layerY]);
                point.getParent().draw();
                point.fire('mousedown');
            });
            this._dblClickCountingFunc = function(e) {
                var dlg = new AppCreator.Dialogs.CountingTextDialog({
                    y: this.getAbsolutePosition().y,
                    x: this.getAbsolutePosition().x,
                    width: 60,
                }), that = this;
                self.getSource().setDraggable(false);
                self.getSource().setNotDraggable(true);
                dlg.submit = function(el) {
                    $(el).serializeObject();
                    that.setText($(el).serializeObject().counting);
                    dlg.remove();
                    self.getSource().setNotDraggable(false);
                    self.getSource().setDraggable(true);
                    that.getParent().draw();
                };
                dlg.cancel = function() {
                    self.getSource().setNotDraggable(false);
                    self.getSource().setDraggable(true);
                    this.remove();
                };
            };
            this._dblClickNameFunc = function(e) {
                var dlg = new AppCreator.Dialogs.TitleDialog({
                    y: this.getAbsolutePosition().y,
                    x: this.getAbsolutePosition().x,
                    width: 60,
                    title: this.getText(),
                    placeholder: "Association"
                }), that = this;
                self.getSource().setDraggable(false);
                self.getSource().setNotDraggable(true);
                dlg.submit = function(el) {
                    $(el).serializeObject();
                    that.setText($(el).serializeObject().name);
                    dlg.remove();
                    self.getSource().setNotDraggable(false);
                    self.getSource().setDraggable(true);
                    that.getParent().draw();
                };
                dlg.cancel = function() {
                    self.getSource().setNotDraggable(false);
                    self.getSource().setDraggable(true);
                    this.remove();
                };
            };
            this._setupTextes();
        },
        _setupTextes: function() {
            this._sourceNameText = new Kinetic.Text({
// x,y when drawing
                text: "-assoc",
                fontSize: 14,
                fontFamily: 'Calibri',
                fill: 'black',
                align: 'center',
                width: 60
            });
            this._sourceCountingText = new Kinetic.Text({
// x,y when drawing
                text: "*",
                fontSize: 14,
                fontFamily: 'Calibri',
                fill: 'black',
                align: 'center',
                width: 28
            });
            this._targetNameText = new Kinetic.Text({
// x,y when drawing
                text: "-assoc",
                fontSize: 14,
                fontFamily: 'Calibri',
                fill: 'black',
                align: 'center',
                width: 60
            });
            this._targetCountingText = new Kinetic.Text({
// x,y when drawing
                text: "*",
                fontSize: 14,
                fontFamily: 'Calibri',
                fill: 'black',
                align: 'center',
                width: 28
            });
            // doubleClicks
            this._sourceCountingText.on('dblclick', this._dblClickCountingFunc);
            this._targetCountingText.on('dblclick', this._dblClickCountingFunc);
            this._sourceNameText.on('dblclick', this._dblClickNameFunc);
            this._targetNameText.on('dblclick', this._dblClickNameFunc);
        },
        addMovePoint: function() {
//TODO: zatial sa tahaju nepriamociaro mozno to prerobit ?
            var points = this.getPoints(),
                    pos = Kinetic.Type._getXY([].slice.call(arguments)),
                    innerPoints = [],
                    point = new AppCreator.MovePoint(
                    {
                        'owner': this,
                        'x': pos.x,
                        'y': pos.y
                    });
            if (points.length < 2 || this._target === null) {
                points.push(point);
            } else {
// calculate point index
                for (var i = 1; i < points.length; i++) {
                    innerPoints.push({'index': i, "len": AppCreator.GraphicTools.pointToLineDistance(
                                {"x": points[i - 1].getX(), "y": points[i - 1].getY()},
                        {"x": points[i].getX(), "y": points[i].getY()},
                        pos)});
                }
                if (innerPoints.length > 0) {
                    innerPoints.sort(function(a, b) {
                        return a.len - b.len;
                    });
                    points.splice(innerPoints[0].index, 0, point);
                } else {
                    points.splice(points.length - 1, 0, point);
                }
            }
            this.setPoints(points);
            if (this.getParent()) {
                this.getParent().add(point);
            } else {
                AppCreator.instance.add2LinesLayer(point);
            }

            return point;
        },
        /**
         * TODO: prerob z Java na js
         * @param {type} newPoint
         * @returns {unresolved}
         */
//        addOrGetBreakPoint: function(newPoint) {
//            for (var breakPoint in breakPoints) {
//                if (GraphicsTools.isPointNearPoint(newPoint, breakPoint, nearTolerance)) {
//                    return breakPoint;
//                }
//            }
//
//            if (breakPoints.isEmpty()) {
//                breakPoints.add(newPoint);
//            } else {
//                var previous = getStart();
//                for (var i = 0; i < breakPoints.size(); i++) {
//                    if (GraphicsTools.isPointNearSegment(previous, breakPoints.get(i), newPoint, nearTolerance)) {
//                        breakPoints.add(i, newPoint);
//                        return newPoint;
//                    }
//                    previous = breakPoints.get(i);
//                }
//                if (GraphicsTools.isPointNearSegment(previous, getEnd(), newPoint, nearTolerance)) {
//                    breakPoints.add(newPoint);
//                }
//            }
//            return newPoint;
//        },
        cleanupUnecessaryBreakPoints: function() {
            var points = this.getPoints(), i = 1,
                    tolerance = AppCreator.GraphicTools.tolerance / 2;
            if (points.length > 2) {
                for (i; i < points.length - 1; i++) {
// ak su vsetky v jednej rovine zmazat stredny
                    if ((points[i - 1].getY() - tolerance < points[i].getY() &&
                            points[i - 1].getY() + tolerance > points[i].getY() &&
                            points[i + 1].getY() - tolerance < points[i].getY() &&
                            points[i + 1].getY() + tolerance > points[i].getY()) ||
                            (points[i - 1].getX() - tolerance < points[i].getX() &&
                                    points[i - 1].getX() + tolerance > points[i].getX() &&
                                    points[i + 1].getX() - tolerance < points[i].getX() &&
                                    points[i + 1].getX() + tolerance > points[i].getX())) {
// vyhodit zmazazt
                        points.splice(i, 1)[0].destroy();
                        i--;
                    }
                }

                this.getParent().draw();
            }
        },
        setTarget: function(target) {
            var self = this, x = 0, y = 0, point;
            // remove listner
            if (self._target) {
                self._target.off('.assoc');
                self._target = null;
            }

            if (!target) {
                return;
            }

            if (self.getSource() && target.getX() <= self.getSource().getX()) {
                x = target.getWidth() + target.getX();
                this.setTargetOffset({
                    'x': target.getWidth(),
                    'y': target.getHeight() / 2
                });
            } else {
                x = target.getX();
                this.setTargetOffset({
                    'x': 0,
                    'y': target.getHeight() / 2
                });
            }

            y = target.getHeight() / 2 + target.getY();
            point = self.addMovePoint([x, y]);
            point.setIsStatic(true);
            point.setTarget(target);
            target.on('dragmove.assoc resize.assoc', function() {
                point.setX(this.getX() + self.getTargetOffset().x);
                point.setY(this.getY() + self.getTargetOffset().y);
                self.getParent().draw();
            });
            self._target = target;
            self.getParent().add(this._sourceCountingText);
            self.getParent().add(this._sourceNameText);
            self.getParent().add(this._targetCountingText);
            self.getParent().add(this._targetNameText);
        },
        _targetDragMoveResizeFunc: function() {

        },
        getTarget: function() {
            return this._target;
        },
        setSource: function(source) {
            var self = this, x = 0, y = 0, xOffset, point;
            // remove listner
            if (self._source) {
                self._source.off('.assoc');
                self._source = null;
            }
            if (!source) {
                return;
            }


            if (self.getTarget()) {
                xOffset = self.getTarget().getX() > source.getX() ? source.getWidth() : 0;
            } else {
                xOffset = source.getWidth();
            }

            this.setSourceOffset({
                'x': xOffset,
                'y': source.getHeight() / 2
            });
            x = source.getX() + xOffset;
            y = source.getHeight() / 2 + source.getY();
            point = self.addMovePoint([x, y]);
            point.setIsStatic(true);
            point.setTarget(source);
            source.on('dragmove.assoc resize.assoc', function() {
                point.setX(this.getX() + self.getSourceOffset().x);
                point.setY(this.getY() + self.getSourceOffset().y);
                self.getParent().draw();
            });
            self._source = source;
        },
        getSource: function() {
            return this._source;
        },
        remove: function() {
            for (var i in this.attrs.points) {
                this.attrs.points[i].remove();
            }

            this.setSource(null);
            this.setTarget(null);

            this._sourceCountingText.remove();
            this._sourceNameText.remove();
            this._targetCountingText.remove();
            this._targetNameText.remove();

            Kinetic.Line.prototype.remove.call(this);
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(), length = points.length,
                    context = canvas.getContext(), point, n = 1;
            context.beginPath();
            context.moveTo(points[0].getX(), points[0].getY());
            points[0].moveToTop();
            for (; n < length; n++) {
                point = points[n];
                context.lineTo(point.getX(), point.getY());
            }

            if (this.getSource() && this._sourceCountingText) {
                this._adjustTextPosition(this._sourceCountingText, points[0], this.getSource(), -20);
                this._adjustTextPosition(this._sourceNameText, points[0], this.getSource(), 10);
            }

            if (this.getTarget() && this._targetCountingText) {
                this._adjustTextPosition(this._targetCountingText, points[length - 1], this.getTarget(), -20);
                this._adjustTextPosition(this._targetNameText, points[length - 1], this.getTarget(), 10);
            }

            canvas.stroke(this);
        }
        ,
        drawHitFunc: function(canvas) {
            var points = this.getPoints(), length = points.length, context = canvas.getContext();
            context.beginPath();
            context.lineWidth = 10;
            context.moveTo(points[0].getX(), points[0].getY());
            for (var n = 1; n < length; n++) {
                var point = points[n];
                context.lineTo(point.getX(), point.getY());
            }
            this.setStrokeWidth(10);
            canvas.stroke(this);
            this.setStrokeWidth(1);
        },
        /**
         * set Position relativly to element
         * @param {type} text
         * @param {type} point
         * @param {type} element
         * @returns {undefined}
         */
        _adjustTextPosition: function(text, point, element, yOffset) {
            var xOffset = 10;
            if (Math.abs(element.getX() - point.getX()) < 10) {
                xOffset = -10 - text.getWidth() | 0;
            }

            text.setPosition([point.getX() + xOffset, point.getY() + yOffset]);
            if (xOffset > 0) {
                text.setAlign('left');
            } else {
                text.setAlign('right');
            }

//            rotation
//            var rotation = AppCreator.GraphicTools.radiansFromPoints(points[0], points[1]) - (points[0].getX() > points[1].getX()? Math.PI:0);
//             this._sourceCountingText.setRotation(rotation*((points[0].getY() < points[1].getY()) ? 1:-1));
        }
    };
    Kinetic.Global.extend(AppCreator.Association, Kinetic.Line);
    Kinetic.Node.addGetterSetter(AppCreator.Association, 'targetOffset', {x: 0, y: 0});
    Kinetic.Node.addGetterSetter(AppCreator.Association, 'sourceOffset', {x: 0, y: 0});
    Kinetic.Node.addGetterSetter(AppCreator.Association, 'sourceName');
    Kinetic.Node.addGetterSetter(AppCreator.Association, 'targetName');
    Kinetic.Node.addGetterSetter(AppCreator.Association, 'targetCounting');
    Kinetic.Node.addGetterSetter(AppCreator.Association, 'sourceCounting');
})();