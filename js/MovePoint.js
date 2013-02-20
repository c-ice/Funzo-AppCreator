
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
            self.setDefaultAttrs({
                radius: 15,
                fill: 'black',
                opacity: 0.5,
                isStatic: false
            });
            // call super constructor
            Kinetic.Circle.call(self, config);
            self.ACType = 'MovePoint';
            self.setDraggable(true);

            self.setDragBoundFunc(function(pos) {
                // static and relative to target
                if (self.getIsStatic() && this.getTarget()) {
                    var targetPos = this.getTarget().getPosition(),
                            targetSize = this.getTarget().getSize(),
                            offset = 16, // corner offset
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
                document.body.style.cursor = 'move';
            });

            self.on('mouseout', function() {
                document.body.style.cursor = 'default';
            });

            self.on('dragstart', function() {
                self._dragStartX = self.getX();
                self._dragStartY = self.getY();
            });

            self.on('dragend', function() {
                self._dragStartX = null;
                self._dragStartY = null;
            });

            self.on('dragmove', function() {
                if (self.getIsStatic() && self.getTarget()) {
                    var pos = {
                        'x': 0,
                        'y': 0
                    };
                    pos.x = self.getX() - self.getTarget().getX();
                    pos.y = self.getY() - self.getTarget().getY();

                    if (self.getOwner().getTarget() === self.getTarget()) {
                        self.getOwner().setTargetOffset(pos);
                    } else {
                        self.getOwner().setSourceOffset(pos);
                    }
                }

                self.getOwner().getParent().draw();
            });

            //            self._target.on('dragmove', function() {
            //                self.setType(self._type);
            //            });
            //            
            //            self._target.on('dragstart', function(){
            ////                var old = self.getParent();
            ////                self.moveTo(this.getParent());
            ////                old.draw();
            //            });
            //            
            //            self._target.on('dragend', function(){
            ////                self.moveTo(this.getParent());
            ////                this.getParent().draw();
            //            });
            //            
            //            self._target.on('widthChange', function(evt) {
            //                  if (!self._dragStartX) {
            //                      self.setType(self._type);
            //                  }
            //            });
        },
        setTarget: function(val) {
            if (val) {
                val.on('resize', function() {
                    this.getDragBoundFunc()(this.getPosition());
                });
            }
        }
    };

    Kinetic.Global.extend(AppCreator.MovePoint, Kinetic.Circle);

    Kinetic.Node.addSetter
    Kinetic.Node.addGettersSetters(AppCreator.MovePoint, ['isStatic', 'target', 'owner']);
})();