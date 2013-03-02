(function() {

    AppCreator.Association = function(config) {
        this._initAssociation(config);
    };

    AppCreator.Association.prototype = {
        _initAssociation: function(config) {
            var self = this;
            self._target = null;
            self._source = null;

            Kinetic.Line.call(self, config);
            this.ACType = 'Association';
            self.on('mousedown', function(e) {
                var point = self.addMovePoint(e.layerX, e.layerY);
                point.getParent().draw();
                point.fire('mousedown');
            });
        },
        addMovePoint: function(x, y) {
            var points = this.getPoints(), originPoint = {'x': x, 'y': y},
            innerPoints = [],
                    point = new AppCreator.MovePoint(
                    {
                        'owner': this,
                        'x': x,
                        'y': y
                    });

            if (points.length < 2) {
                points.push(point);
            } else {
                // calculate point index
                // TODO: pracuj nefunguje spravne prerob ked budes ciary tahat priamociaro
                for (var i = 1; i < points.length; i++) {
                    innerPoints.push({'index': i, "len": AppCreator.GraphicTools.pointToLineDistance(
                                {"x": points[i-1].getX(), "y": points[i-1].getY()},
                                {"x": points[i].getX(), "y": points[i].getY()},
                        {'x': x, 'y': y})});
                }
                if (innerPoints.length > 0) {
                    innerPoints.sort(function(a, b) {
                        return a.len - b.len;
                    });
                    points.splice(innerPoints[0].index , 0, point);
                } else {
                    points.splice(points.length - 1, 0, point);
                }
//                for (var i = 0; i < points.length; i++) {
//                    innerPoints.push({'index': i, "len": AppCreator.GraphicTools.pointToPointDistance(
//                                points[i].getPosition(),
//                                originPoint
//                                )});
//                }
//                if (innerPoints.length > 0) {
//                    innerPoints.sort(function(a, b) {
//                        return a.len - b.len;
//                    });
//
//                    var len1 = (innerPoints[0].index - 1 < 0)? 
//
//                    if (AppCreator.GraphicTools.pointToLineDistance(
//                            points[innerPoints[0].index].getPosition(),
//                            points[innerPoints[0].index + 1].getPosition(),
//                            originPoint)
//                            >
//                            AppCreator.GraphicTools.pointToLineDistance(
//                            points[innerPoints[0].index].getPosition(),
//                            points[innerPoints[0].index - 1].getPosition(),
//                            originPoint)) {
//                                
//                                
//                    } else {
//
//                    }
//                    points.splice(innerPoints[0].index, 0, point);
//                } else {
//                    points.splice(points.length - 1, 0, point);
//                }
            }
            this.setPoints(points);

            if (this.getParent()) {
                this.getParent().add(point);
            } else {
                instance._linesLayer.add(point);
            }

            return point;
        },
        addOrGetBreakPoint: function(newPoint) {
            for (var breakPoint in breakPoints) {
                if (GraphicsTools.isPointNearPoint(newPoint, breakPoint, nearTolerance)) {
                    return breakPoint;
                }
            }

            if (breakPoints.isEmpty()) {
                breakPoints.add(newPoint);
            } else {
                var previous = getStart();
                for (var i = 0; i < breakPoints.size(); i++) {
                    if (GraphicsTools.isPointNearSegment(previous, breakPoints.get(i), newPoint, nearTolerance)) {
                        breakPoints.add(i, newPoint);
                        return newPoint;
                    }
                    previous = breakPoints.get(i);
                }
                if (GraphicsTools.isPointNearSegment(previous, getEnd(), newPoint, nearTolerance)) {
                    breakPoints.add(newPoint);
                }
            }
            return newPoint;
        },
        cleanupUnecessaryBreakPoints: function() {
            var previous = getStart();
            for (var i = 0; i < breakPoints.size(); i++) {
                var current = breakPoints.get(i);
                var next = i < (breakPoints.size() - 1) ? breakPoints.get(i + 1) : getEnd();
                var tolerance = Math.round(0.1 * previous.distance(next));
                if (GraphicsTools.isPointNearSegment(previous, next, current, tolerance)) {
                    breakPoints.remove(i--);
                } else {
                    previous = breakPoints.get(i);
                }
            }
        },
        setTarget: function(target) {
            var self = this, x = 0, y = 0, point;
            // remove listner
            if (self._target) {
                self._target.off('dragmove');
                self._target.off('resize');
            }
            self._target = target;

            if (self.getSource() && self._target.getX() < self.getSource().getX()) {
                x = self._target.getWidth() + self._target.getX();
                this.setTargetOffset({
                    'x': self._target.getWidth(),
                    'y': self._target.getHeight() / 2
                });
            } else {
                x = self._target.getX();
                this.setTargetOffset({
                    'x': 0,
                    'y': self._target.getHeight() / 2
                });
            }

            y = self._target.getHeight() / 2 + self._target.getY();

            point = self.addMovePoint(x, y);
            point.setIsStatic(true);
            point.setTarget(self._target);

            self._target.on('dragmove resize', function() {
                point.setX(this.getX() + self.getTargetOffset().x);
                point.setY(this.getY() + self.getTargetOffset().y);
                self.getParent().draw();
            });

        },
        getTarget: function() {
            return this._target;
        },
        setSource: function(source) {
            var self = this, x = 0, y = 0, point;
            // remove listner
            if (self._source) {
                self._source.off('dragmove');
                self._source.off('resize');
            }
            self._source = source;

            if (self.getTarget() && self.getTarget().getX() > self._source.getX()) {
                x = self._source.getWidth() + self._source.getX();
                this.setSourceOffset({
                    'x': self._source.getWidth(),
                    'y': self._source.getHeight() / 2
                });
            } else {
                x = self._source.getX();
                this.setSourceOffset({
                    'x': 0,
                    'y': self._source.getHeight() / 2
                });
            }

            y = self._source.getHeight() / 2 + self._target.getY();

            point = self.addMovePoint(x, y);
            point.setIsStatic(true);
            point.setTarget(self._source);

            self._source.on('dragmove resize', function() {
                point.setX(this.getX() + self.getSourceOffset().x);
                point.setY(this.getY() + self.getSourceOffset().y);
                self.getParent().draw();
            });
        },
        getSource: function() {
            return this._source;
        },
        _calculatePoints: function() {
            var points = this.getPoints();
            var len = points.length;

            if (len < 3 && points[0].getY() !== points[len - 1].getY()) {
                len = points.push(new AppCreator.MovePoint({
                    owner: this,
                    index: 2
                }),
                new AppCreator.MovePoint({
                    owner: this,
                    index: 3
                }));
                points[0].moveTo(this.getParent());
                points[0].setIsStatic(true);
                points[0].setTarget(this.getSource());
                points[1].moveTo(this.getParent());
                points[2].moveTo(this.getParent());
                points[3].moveTo(this.getParent());
                points[3].setIsStatic(true);
                points[3].setTarget(this.getTarget());
                this.setSourceOffset({
                    x: this.getSource().getWidth(),
                    y: this.getSource().getHeight() / 2
                });
                this.setTargetOffset({
                    x: 0,
                    y: this.getTarget().getHeight() / 2
                });
            }
            var xOffset = 0;
            if (!points[0].getIsStatic()) {
                xOffset = (this.getSource().getX() > this.getTarget().getX()) ? 0 : this.getSource().getWidth();
                points[0].setX(this.getSource().getX() + xOffset);
                points[0].setY(this.getSource().getHeight() / 2 + this.getSource().getY());
            } else {
                points[0].setX(this.getSource().getX() + this.getSourceOffset().x);
                points[0].setY(this.getSource().getY() + this.getSourceOffset().y);
            }

            if (!points[len - 1].getIsStatic()) {
                xOffset = (this.getSource().getX() < this.getTarget().getX()) ? 0 : this.getTarget().getWidth();
                points[len - 1].setX(xOffset + this.getTarget().getX());
                points[len - 1].setY(this.getTarget().getHeight() / 2 + this.getTarget().getY());
            } else {
                points[len - 1].setX(this.getTarget().getX() + this.getTargetOffset().x);
                points[len - 1].setY(this.getTarget().getY() + this.getTargetOffset().y);
            }

            for (var i = 1; i < len - 1; i++) {
                if (points[len - 1].getY() === points[0].getY() ||
                        points[len - 1].getX() === points[0].getX()) {
                    points[i].remove();
                    points = [].concat(points.slice(0, i), points.slice(i + 1, len));
                    len--;
                } else {
                    points[i].setX(points[len - 1].getX() + (points[0].getX() - points[len - 1].getX()) / 2);
                    points[i].setY((i > 1) ? points[len - 1].getY() : points[0].getY());
                }
            }

            this.setPoints(points);
            this.getParent().draw();
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(), length = points.length, context = canvas.getContext();
            context.beginPath();
            context.moveTo(points[0].getX(), points[0].getY());

            for (var n = 1; n < length; n++) {
                var point = points[n];
                context.lineTo(point.getX(), point.getY());
            }

            canvas.stroke(this);
        },
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
        }
    };

    Kinetic.Global.extend(AppCreator.Association, Kinetic.Line);

    Kinetic.Node.addGettersSetters(AppCreator.Association, ['targetOffset', 'sourceOffset']);

})();