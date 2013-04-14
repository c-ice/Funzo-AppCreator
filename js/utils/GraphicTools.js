/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function() {
    //static tools
    AppCreator.GraphicTools = {};
    AppCreator.GraphicTools.xCor = function(len, dir) {
        return Math.floor(len * Math.cos(dir));
    };

    AppCreator.GraphicTools.yCor = function(len, dir) {
        return Math.floor(len * Math.sin(dir));
    };

    AppCreator.GraphicTools.tolerance = 10;

    AppCreator.GraphicTools.getCorners = function(element) {
        if (element.ACType === 'Element') {
            var pos = element.getPosition();
            var corners = [{
                    x: pos.x,
                    y: pos.y
                },
                {
                    x: pos.x + element.getWidth(),
                    y: pos.y
                },
                {
                    x: pos.x,
                    y: pos.y + element.getHeight()
                },
                {
                    x: pos.x + element.getWidth(),
                    y: pos.y + element.getHeight()
                }
            ];

            return corners;
        } else {
            return [element.getPosition()];
        }
    };

    AppCreator.GraphicTools.Position = {
        North: 1,
        South: 2,
        East: 4,
        West: 8
    };

    /**
     * position
     * @param {Element|MovePoint} staticObject not dragged element
     * @param {Element} draggedObject dragged element
     * @return {Position}
     */
    AppCreator.GraphicTools.determinePosition = function(staticObject, draggedObject) {
        var a = AppCreator.GraphicTools.getCorners(staticObject);
        var b = AppCreator.GraphicTools.getCorners(draggedObject);
        var rightSide = 0, leftSide = 0;
        var upSide = 0, downSide = 0;

        for (var i = 0; i < a.length; i++) {
            if (a[i].x < b[0].x) {
                rightSide++;
            }
            if (a[i].x > b[1].x) {
                leftSide++;
            }
            if (a[i].y < b[0].y) {
                upSide++;
            }
            if (a[i].y > b[3].y) {
                downSide++;
            }
        }

        var result = 0;
        if (rightSide === 4) {
            result = result | AppCreator.GraphicTools.Position.East;
        } else if (leftSide === 4) {
            result = result | AppCreator.GraphicTools.Position.West;
        }

        if (upSide === 4) {
            result = result | AppCreator.GraphicTools.Position.South;
        } else if (downSide === 4) {
            result = result | AppCreator.GraphicTools.Position.North;
        }

        return result;
    };

    /**
     * 
     * @param {Point} from
     * @param {Point} to
     * @param {Point} testPos
     * @param {int} nearTolerance
     * @returns {@exp;r@call;intersectsLine}
     */
    AppCreator.GraphicTools.isPointNearSegment = function(from, to, testPos, nearTolerance) {
        var r = new Kinetic.Rect({
            x: testPos.x - nearTolerance / 2,
            y: testPos.y - nearTolerance / 2,
            width: nearTolerance,
            height: nearTolerance
        });
        return r.intersectsLine(from.x, from.y, to.x, to.y);
    };

    /**
     * 
     * @param {Point} from
     * @param {Point} testPos
     * @param {int} nearTolerance
     * @returns {@exp;AppCreator@pro;GraphicTools@call;rectangleIntersection}
     */
    AppCreator.GraphicTools.isPointNearPoint = function(from, testPos, nearTolerance) {
        var r1 = {
            x: from.x - nearTolerance / 2,
            y: from.y - nearTolerance / 2,
            width: nearTolerance,
            height: nearTolerance
        };

        var r2 = {x: testPos.x, y: testPos.y, width: 1, height: 1};
        return AppCreator.GraphicTools.rectangleIntersection(r1, r2);
    };
    /**
     * // Copied from pnapi Rectangle.java
     * @param {Rectangle} r1
     * @param {Rectangle} r2
     * @returns {Boolean}
     */
    AppCreator.GraphicTools.rectangleIntersection = function(r1, r2) {
        var tw = r2.width, th = r2.height, rw = r1.width, rh = r1.height;
        if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
            return false;
        }
        var tx = r2.x, ty = r2.y, rx = r1.x, ry = r1.y;
        rw += rx;
        rh += ry;
        tw += tx;
        th += ty;
        //      overflow || intersect
        return ((rw < rx || rw > tx) &&
                (rh < ry || rh > ty) &&
                (tw < tx || tw > rx) &&
                (th < ty || th > ry));
    };
    
    /**
     * |AB|
     * @param {Point} p1
     * @param {point} p2
     * @returns {@exp;Math@call;sqrt}
     */
    AppCreator.GraphicTools.pointToPointDistance = function(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };
    
    AppCreator.GraphicTools.pointToLineDistance = function(a, b, p) {
        var normalLength = AppCreator.GraphicTools.pointToPointDistance(a, b);
        return Math.abs((p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x)) / normalLength;
    };

    /**
     * 
     * @param {Point|MovePoint} A
     * @param {Point|MovePoint} B
     * @returns {Number}
     */
    AppCreator.GraphicTools.radiansFromPoints = function(A, B) {
        if (A.getX && B.getX) {
            return Math.atan(Math.abs(A.getY() - B.getY())/(Math.abs(A.getX() - B.getX())));
        } else {
            return Math.atan(((A.x - B.x) / (A.y - B.y))|0);
        }
    };

})();