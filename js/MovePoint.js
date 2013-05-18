
/**
 * point redered around element for resizing
 */
(function() {

    AppCreator.MovePoint = function(config) {
        this._initMovePoint(config);
    };

    AppCreator.MovePoint.prototype = {
        _initMovePoint: function(config) {
            var self = this;

            self.createAttrs();
            // call super constructor
            Kinetic.Circle.call(self, config);
            self.setRadius(6);
            self.setFill('black');
            self.setOpacity(0.5);

            self.ACType = 'MovePoint';
            self.setDraggable(true);
            self._offset = 15;

            self.setDragBoundFunc(function(pos) {
                // static and relative to target
                if (self.getIsStatic() && self.getTarget()) {
                    var targetPos = self.getTarget().getPosition(),
                            targetSize = self.getTarget().getSize(),
                            offset = self._offset, // corner offset
                            newPos = {
                        'y': Math.min(Math.max(pos.y, targetPos.y), targetPos.y + targetSize.height),
                        'x': Math.min(Math.max(pos.x, targetPos.x + offset), targetPos.x + targetSize.width - offset)
                    };

                    if (!(newPos.y <= targetPos.y + offset / 2 ||
                            newPos.y >= targetPos.y + targetSize.height - offset / 2)) {
                        // !isUpOrDown
                        if (newPos.x < ((targetSize.width / 2) + targetPos.x)) {
                            // left
                            newPos.x = targetPos.x;
                        } else {
                            // right
                            newPos.x = targetPos.x + targetSize.width;
                        }

                        newPos.y = Math.min(Math.max(newPos.y, targetPos.y + offset), targetPos.y + targetSize.height + offset);
                    }

                    return newPos;
                } else {
                    return pos;
                }
            });

            self.on('mouseover', function() {
                AppCreator.setCursorTo('move');
            });

            self.on('mouseout', function() {
                AppCreator.defaultCursor();
            });

            self.on('dragstart', function(e) {
                self._dragStartX = self.getX();
                self._dragStartY = self.getY();
            });

            self.on('dragend', function() {
                self._dragStartX = null;
                self._dragStartY = null;
                self.snapToGrid();
                self.getOwner().cleanupUnecessaryBreakPoints();
            });

            self.on('dragmove', function(e) {
                //e.preventDefault();
                if (self.getIsStatic() && self.getTarget()) {
                    var pos = {
                        'x': 0,
                        'y': 0
                    };
                    pos.x = self.getX() - self.getTarget().getX();
                    pos.y = self.getY() - self.getTarget().getY();

                    if (self.getOwner().getPoints()[0] === self) {
                        self.getOwner().setSourceOffset(pos);
                    } else {
                        self.getOwner().setTargetOffset(pos);
                    }
                }

                self.getOwner().getParent().draw();
            });
        },
        setTarget: function(val) {
            if (val !== undefined) {
                var self = this;
                val.on('resize' + self.getOwner().getId(), function() {
                    var pos = self.attrs['dragBoundFunc'](self.getPosition());
                    self.setPosition(pos);
                    self.fire('dragmove');
                });

                self.setAttr('target', val);
            }
        },
        snapToGrid: function() {

//            if (this.getTarget() !== undefined) {
//                var targetOffset = this.getOwner().getTargetOffset(),
//                        targetSize = this.getTarget().getSize();
//
//                targetOffset.x = (Math.min(Math.max(Math.floor(targetOffset.x / AppCreator.gridSize) * AppCreator.gridSize, 0), targetSize.width));
//                targetOffset.y = (Math.min(Math.max(Math.floor(targetOffset.y / AppCreator.gridSize) * AppCreator.gridSize, 0), targetSize.height));
//
//                this.getOwner().setTargetOffset(targetOffset);
//            }
        },
        drawHitFunc: function(canvas) {
            var context = canvas.getContext();
            context.beginPath();
            context.arc(0, 0, 12, 0, Math.PI * 2, true);
            context.closePath();
            canvas.fillStroke(this);
        }
    };

    Kinetic.Global.extend(AppCreator.MovePoint, Kinetic.Circle);

    Kinetic.Node.addGetter(AppCreator.MovePoint, 'target');
    Kinetic.Node.addGetterSetter(AppCreator.MovePoint, 'isStatic', false);
    Kinetic.Node.addGetterSetter(AppCreator.MovePoint, 'owner');
})();