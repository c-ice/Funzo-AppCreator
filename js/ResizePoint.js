/**
 * point redered around element for resizing
 */
(function() {
    
    AppCreator.ResizePoint = function(config) {
        this._initResizePoint(config);
    };
    
    AppCreator.ResizePoint.Type = {
        NorthWest:  {id:1, value:"nw-resize"},
        West:       {id:2, value:'w-resize'},
        SouthWest:  {id:3, value:'sw-resize'},
        South:      {id:4, value:'s-resize'},
        SouthEast:  {id:5, value:'se-resize'},
        East:       {id:6, value:'e-resize'},
        NorthEast:  {id:7, value:'ne-resize'},
        North:      {id:8, value:'n-resize'}
    };
    
    AppCreator.ResizePoint.prototype = {
        _initResizePoint: function(config) {
            var self = this;
            self._type = {};
            self._target = config.target;
            self.setDefaultAttrs({
                radius: 15,
                x: -5,
                y: -5,
//                fill: 'black',
//                opacity: 0.5,
                draggable: true
            });
            // call super constructor
            Kinetic.Circle.call(self, config);
            self.ACType = 'ResizePoint';
            
            self.on('mouseover', function(){
                document.body.style.cursor = self._type.value;
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
                    
                    if (self._type.id == AppCreator.ResizePoint.Type.NorthEast.id || 
                        self._type.id == AppCreator.ResizePoint.Type.SouthEast.id) {
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

                    if (self._type.id == AppCreator.ResizePoint.Type.NorthEast.id || 
                        self._type.id == AppCreator.ResizePoint.Type.NorthWest.id) {
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
        },
        /**
         * One from Enum ResizePoint.Type
         * @param {Type}
         */
        setType: function(type) {
            var deltaX = 0, deltaY = 0;
            switch(type.id) {
                case AppCreator.ResizePoint.Type.NorthWest.id:
                    deltaY = 0;//-this.getHeight();
                    deltaX = 0;//-this.getWidth();
                    break;
                case AppCreator.ResizePoint.Type.SouthWest.id:
                    deltaY = this._target.getHeight();
                    deltaX = 0;//-this.getWidth();
                    break;
                case AppCreator.ResizePoint.Type.SouthEast.id:
                    deltaY = this._target.getHeight();
                    deltaX = this._target.getWidth();
                    break;
                case AppCreator.ResizePoint.Type.NorthEast.id:
                    deltaY = 0;//-this.getHeight();
                    deltaX = this._target.getWidth();
                    break;
            }
            
            this.setX(this._target.getX() + deltaX);
            this.setY(this._target.getY() + deltaY);
            
            this._type = type;
        }
    }
    
    Kinetic.Global.extend(AppCreator.ResizePoint, Kinetic.Circle);
})();