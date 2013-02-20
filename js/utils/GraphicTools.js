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


})();