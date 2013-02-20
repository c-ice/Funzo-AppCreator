
/**
 * point redered around element for resizing
 */
(function() {

    AppCreator.Arrow = function(config) {
        this._initArrow(config);
    };

    AppCreator.Arrow.prototype = {
        _initArrow: function(config) {
            this.setDefaultAttrs({
                fill: 'black'
            });
            // call super constructor
            Kinetic.Polygon.call(this, config);
            self.ACType = 'Arrow';
            this._setDrawFuncs();
            this.superDrawFunc = this.getDrawFunc();

            this.setDrawFunc(function(canvas) {
                var x = this.getArrowTip().x;
                var y = this.getArrowTip().y;
                var aDir = Math.atan2(this.getCenter().x - x, this.getCenter().y - y);
                var tmpPoly = [];
                var i1 = 12;
                var i2 = 6;							// make the arrow head the same size regardless of the length length
                tmpPoly.push(x, y);							// arrow tip
                tmpPoly.push(x + AppCreator.GraphicTools.xCor(i1, aDir + 0.5), y + AppCreator.GraphicTools.yCor(i1, aDir + 0.5));
                tmpPoly.push(x + AppCreator.GraphicTools.xCor(i2, aDir), y + AppCreator.GraphicTools.yCor(i2, aDir));
                tmpPoly.push(x + AppCreator.GraphicTools.xCor(i1, aDir - 0.5), y + AppCreator.GraphicTools.yCor(i1, aDir - 0.5));
                tmpPoly.push(x, y);
                this.setPoints(tmpPoly);
                this.superDrawFunc(canvas);
            });

        }
    };

    Kinetic.Global.extend(AppCreator.Arrow, Kinetic.Polygon);

    Kinetic.Node.addGettersSetters(AppCreator.Arrow, ['center', 'arrowTip']);
})();