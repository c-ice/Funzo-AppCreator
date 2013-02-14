
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
                index: 0,
                isStatic: false
            });
            // call super constructor
            Kinetic.Circle.call(self, config);
            self.ACType = 'MovePoint';
            self.setDraggable(true);
            self.setDragBoundFunc(function(pos){
                if (self.getIsStatic()) {
                    var targetPos = this.getTarget().getPosition();
                    var targetSize = this.getTarget().getSize();
                    var offset = 5; // corner offset

                    var newPos = {
                        y: pos.y < targetPos.y ? targetPos.y: pos.y,
                        x: pos.x < targetPos.x ? targetPos.x: pos.x
                    };
                    
                    newPos.x = (targetPos.x + targetSize.width) < newPos.x ? targetPos.x + targetSize.width : newPos.x;
                    newPos.y = (targetPos.y + targetSize.height) < newPos.y ? targetPos.y + targetSize.height : newPos.y;
                    
                    
                    if ((newPos.x < ((targetSize.width/2)+ targetPos.x)) &&
                        newPos.y < targetPos.y + offset)
                        newPos.x = (newPos.x < ((targetSize.width/2)+ targetPos.x))? targetPos.x : (targetPos.x + targetSize.width);
                    
                    return newPos;
                } else {
                    return pos;
                }
            });
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
                if (self.getIsStatic()) {
                    if (self.getOwner().getTarget() == self.getTarget()) {
                        self.getOwner().setTargetOffset({
                            x:(self.getX()-self.getTarget().getX()),
                            y:(self.getY()-self.getTarget().getY())
                        });
                    } else {
                        self.getOwner().setSourceOffset({
                            x:(self.getX() - self.getTarget().getX()),
                            y:(self.getY() - self.getTarget().getY())
                        });
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
        }
    }
    
    Kinetic.Global.extend(AppCreator.MovePoint, Kinetic.Circle);
    
    Kinetic.Node.addGettersSetters(AppCreator.MovePoint, ['index', 'isStatic', 'target', 'owner']);
})();