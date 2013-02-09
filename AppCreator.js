/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var AppCreator = {};

AppCreator.stage =  new Kinetic.Stage({
            container: 'container',
            width: 878,
            height: 600
        });

AppCreator.gridSize = 5;
AppCreator.layer = new Kinetic.Layer();
AppCreator.linesLayer = new Kinetic.Layer();

AppCreator.stage.add(AppCreator.linesLayer);
AppCreator.stage.add(AppCreator.layer);

            
