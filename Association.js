(function() {
    
    AppCreator.Association = function(config) {
        this._initAssociation(config);
    };
    
    AppCreator.Association.prototype = {
        _initAssociation: function(config) {
            var self = this;
            self._target = null;
            self._source = null;
            self._targetOffset = {'x':0,'y':0};
            self._sourceOffset = {'x':0,'y':0};
            self.setDefaultAttrs({
                points: [0,0,0,0]
            });
            
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
            self.setPoints([self.getPoints()[0].x, self.getPoints()[0].y, x, y]);
            
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
            self.setPoints([x, y, self.getPoints()[1].x, self.getPoints()[1].y]);
            
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
            
            if (len < 3 && points[0].y != points[len - 1].y) {
                len = points.push({
                    x:0,
                    y:0
                }, {
                    x:0,
                    y:0
                });
            }
            
            points[0].x = this.getSource().getWidth()/2 + this.getSource().getX();
            points[0].y = this.getSource().getHeight()/2 + this.getSource().getY();
            
            points[len - 1].x = this.getTarget().getWidth()/2 + this.getTarget().getX();
            points[len - 1].y = this.getTarget().getHeight()/2 + this.getTarget().getY();
            
            for (var i = 1; i < len - 1; i++) {
                points[i].x = points[len - 1].x + (points[0].x - points[len - 1].x)/2;
                points[i].y = (i > 1)? points[len - 1].y : points[0].y; 
            }
 
            this.setPoints(points);
            this.getParent().draw();
        }
        
        
        
    }
    
    Kinetic.Global.extend(AppCreator.Association, Kinetic.Line);
})();