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

            Kinetic.Line.call(this, config);

            this.attrs.stroke = 'black';
            this.attrs.strokeWidth = 1;

            this.ACType = 'Association';
            this.on('mousedown', function(e) {
                var point = self.addMovePoint([e.layerX, e.layerY]);
                point.getParent().draw();
                point.fire('mousedown');
            });
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
//            var previous = getStart();
//            for (var i = 0; i < breakPoints.size(); i++) {
//                var current = breakPoints.get(i);
//                var next = i < (breakPoints.size() - 1) ? breakPoints.get(i + 1) : getEnd();
//                var tolerance = Math.round(0.1 * previous.distance(next));
//                if (GraphicsTools.isPointNearSegment(previous, next, current, tolerance)) {
//                    breakPoints.remove(i--);
//                } else {
//                    previous = breakPoints.get(i);
//                }
//            }
        },
        setTarget: function(target) {
            var self = this, x = 0, y = 0, point;
            // remove listner
            if (self._target) {
                self._target.off('dragmove');
                self._target.off('resize');
                self._target = null;
            }

            if (self.getSource() && target.getX() < self.getSource().getX()) {
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

            target.on('dragmove resize', function() {
                point.setX(this.getX() + self.getTargetOffset().x);
                point.setY(this.getY() + self.getTargetOffset().y);
                self.getParent().draw();
            });

            self._target = target;
        },
        getTarget: function() {
            return this._target;
        },
        setSource: function(source) {
            var self = this, x = 0, y = 0, xOffset, point;
            // remove listner
            if (self._source) {
                self._source.off('dragmove');
                self._source.off('resize');
            }
            self._source = source;

            if (self.getTarget()) {
                xOffset = self.getTarget().getX() > self._source.getX() ? self._source.getWidth() : 0;
            } else {
                xOffset = self._source.getWidth();
            }

            this.setSourceOffset({
                'x': xOffset,
                'y': self._source.getHeight() / 2
            });

            x = self._source.getX() + xOffset;
            y = self._source.getHeight() / 2 + self._source.getY();

            point = self.addMovePoint([x, y]);
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
        drawFunc: function(canvas) {
            var points = this.getPoints(), length = points.length, context = canvas.getContext();
            context.beginPath();
            context.moveTo(points[0].getX(), points[0].getY());
            points[0].moveToTop();

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

    Kinetic.Node.addGetterSetter(AppCreator.Association, 'targetOffset', {x: 0, y: 0});
    Kinetic.Node.addGetterSetter(AppCreator.Association, 'sourceOffset', {x: 0, y: 0});
})();