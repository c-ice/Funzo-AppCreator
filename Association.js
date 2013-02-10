(function() {
    
    AppCreator.Association = function(config) {
        this._initAssociation(config);
    };
    
    AppCreator.Association.prototype = {
        _initAssociation: function(config) {
            var self = this;
            self._target = null;
            self._source = null;
            self._targetOffset = {
                'x':0,
                'y':0
            };
            self._sourceOffset = {
                'x':0,
                'y':0
            };
            
            Kinetic.Line.call(self, config);
            this.ACType = 'Association' 
            self.on('click', function() {
                
                });
        },
        setTarget: function(target) {
            var self = this;
            // remove listner
            if (self._target) {
                self._target.off('dragmove');
                self._target.off('resize');
            }
            self._target = target;
            var x = self._target.getWidth()/2 + self._target.getX();
            var y = self._target.getHeight()/2 + self._target.getY();
            var points = self.getPoints();
            points.push(new AppCreator.MovePoint(
            {
                target: self, 
                index: 1,
                'x':x, 
                'y':y
            }));

            self.setPoints(points);
            
            self._target.on('dragmove resize', function(){
                self._calculatePoints();
            });
            
        },
        getTarget: function() {
            return this._target;
        },
        setSource: function(source) {
            var self = this;
            // remove listner
            if (self._source) {
                self._source.off('dragmove');
                self._source.off('resize');
            }
            self._source = source;
            var x = self._source.getWidth()/2 + self._source.getX();
            var y = self._source.getHeight()/2 + self._source.getY();
            var points = self.getPoints();
            points.push(new AppCreator.MovePoint({
                target: self, 
                index: 0,
                'x':x, 
                'y':y
            }));

            self.setPoints(points);
            
            self._source.on('dragmove resize', function(){
                self._calculatePoints();
            });
        },
        getSource: function() {
            return this._source;
        },
        _calculatePoints: function() {
            var points = this.getPoints();
            var len = points.length;
            
            if (len < 3 && points[0].getY() != points[len - 1].getY()) {
                len = points.push(new AppCreator.MovePoint({
                    target: this, 
                    index: 2
                }), 
                new AppCreator.MovePoint({
                    target: this, 
                    index: 3
                }));
                points[0].moveTo(this.getParent());
                points[1].moveTo(this.getParent());
                points[2].moveTo(this.getParent());
                points[3].moveTo(this.getParent());
            }
            
            points[0].setX(this.getSource().getWidth()/2 + this.getSource().getX());
            points[0].setY(this.getSource().getHeight()/2 + this.getSource().getY());
            
            points[len - 1].setX(this.getTarget().getWidth()/2 + this.getTarget().getX());
            points[len - 1].setY(this.getTarget().getHeight()/2 + this.getTarget().getY());
            
            for (var i = 1; i < len - 1; i++) {
                points[i].setX(points[len - 1].getX() + (points[0].getX() - points[len - 1].getX())/2);
                points[i].setY((i > 1)? points[len - 1].getY() : points[0].getY()); 
            }
 
            this.setPoints(points);
            this.getParent().draw();
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(), length = points.length, context = canvas.getContext();
            context.beginPath();
            context.moveTo(points[0].getX(), points[0].getY());

            for(var n = 1; n < length; n++) {
                var point = points[n];
                context.lineTo(point.getX(), point.getY());
            }

            canvas.stroke(this);
        }
        
        
        
    }
    
    Kinetic.Global.extend(AppCreator.Association, Kinetic.Line);
})();