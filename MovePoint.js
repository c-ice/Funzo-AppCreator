
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
            self._index = 0;
            self._target = config.target;
            self.setDefaultAttrs({
                radius: 15,
//                fill: 'black',
//                opacity: 0.5,
                draggable: true
            });
            // call super constructor
            Kinetic.Circle.call(self, config);
            self.ACType = 'MovePoint';
            
            self.on('mouseover', function(){
                document.body.style.cursor = 'move';
            });
            
            self.on('mouseout', function(){
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
                var newWidth = self._target.getWidth();
                var newHeight = self._target.getHeight();
                if (self.getX() != self.dragStartX) {
                    var deltaX = self._dragStartX - self.getX();
                    
                    if (self._type.id == AppCreator.MovePoint.Type.NorthEast.id || 
                        self._type.id == AppCreator.MovePoint.Type.SouthEast.id) {
                        if (this._target.getMinSize().width <= newWidth - deltaX) {
                            newWidth -= deltaX;
                        } else {
                            self.setX(self._dragStartX);
                        }
                    } else {
                        // constraint to minSize
                        if (this._target.getMinSize().width <= newWidth + deltaX) {
                            newWidth += deltaX;
                            self._target.setX(self._target.getX() - deltaX);
                        } else {
                            self.setX(self._dragStartX);
                        }
                    }
                    
                    self._dragStartX = self.getX();
                }
                if (self._dragStartY != self.getY()) {
                    var deltaY = self._dragStartY - self.getY();

                    if (self._type.id == AppCreator.MovePoint.Type.NorthEast.id || 
                        self._type.id == AppCreator.MovePoint.Type.NorthWest.id) {
                        // constraint to minSize
                        if (this._target.getMinSize().height <= newHeight + deltaY) {
                            newHeight += deltaY;
                            self._target.setY(self._target.getY() - deltaY);
                        } else {
                            self.setY(self._dragStartY);
                        }
                    } else {
                        if (this._target.getMinSize().height <= newHeight - deltaY) {
                            newHeight -= deltaY;
                        } else {
                            self.setY(self._dragStartY);
                        }
                    }
                    
                    self._dragStartY = self.getY();
                }
                
                self._target.resizeToNewSize(newWidth, newHeight);
                self._target.getParent().draw();
            });
            
            self._target.on('dragmove', function() {
                self.setType(self._type);
            });
            
            self._target.on('dragstart', function(){
//                var old = self.getParent();
//                self.moveTo(this.getParent());
//                old.draw();
            });
            
            self._target.on('dragend', function(){
//                self.moveTo(this.getParent());
//                this.getParent().draw();
            });
            
            self._target.on('widthChange', function(evt) {
                  if (!self._dragStartX) {
                      self.setType(self._type);
                  }
            });
        }
    }
    
    Kinetic.Global.extend(AppCreator.MovePoint, Kinetic.Circle);
})();