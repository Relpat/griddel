// basic confs
var width = 800,
    height = 600,
    numberOfQuadraticFields = 25,
    fieldSize = 20;

// start app
var app = new PIXI.Application(width, height, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

// containers etc
var container = new PIXI.Container();
app.stage.addChild(container);

var config = {
    size: {
        x: numberOfQuadraticFields,
        y: numberOfQuadraticFields
    }
};
var gamefieldGrid = new Grid(config);

// https://github.com/qiao/PathFinding.js
var grid = new PF.Grid(numberOfQuadraticFields, numberOfQuadraticFields);
// some actions
initTestApp();

function initTestApp() {
    function createGridLayout(xIndex, yIndex) {
        var xPos = fieldSize * xIndex;
        var yPos = fieldSize * yIndex;

        var graphics = new PIXI.Graphics();
        // index in gamefield
        graphics.x = xIndex;
        graphics.y = yIndex;

        // interactive shit
        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.on('pointerup', defineStartAndEnd);
        // set a fill and line style
        graphics.lineStyle(1, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(
            xPos, yPos,
            fieldSize, fieldSize);
        graphics.endFill();

        container.addChild(graphics);

        return graphics;
    }

    for (var iX = 0; iX < numberOfQuadraticFields; iX++) {
        for (var iY = 0; iY < numberOfQuadraticFields; iY++) {
            var gridGraphicObject = createGridLayout(iX, iY);

            // set object
            var gridField = gamefieldGrid.gamefields[iX][iY];
            gridField.setObject(gridGraphicObject)
        }
    }
}

var startObject = null;
var endObject = null;

function defineStartAndEnd() {
    if (startObject) {
        // start pathfinding
        endObject = this;

        var finder = new PF.AStarFinder({
            allowDiagonal: true
        });
        gridComputing = grid.clone();
        var path = finder.findPath(
            startObject.x, startObject.y,
            endObject.x, endObject.y,
            gridComputing
        );

        var pathObjects = [];
        for (var index in path) {
            pathObjects.push(
                gamefieldGrid.gamefields
                    [path[index][0]]
                    [path[index][1]]
            );
        }

        showPath(pathObjects);
        // reset
        startObject.alpha = 1;
        endObject.alpha = 1;
        startObject = null;
        endObject = null;

    } else {
        startObject = this;
        this.alpha = 0.4;
    }
}


function showPath(objectArray) {

    for(var index in objectArray){
        objectArray[index].getObject().alpha = 0.7;
    }
}


// Listen for animate update
app.ticker.add(
    function (delta) {
        appLoop(delta);
    }
);


function appLoop(delta) {

    // for (var index in container.children) {
    //     bunny = container.children[index];
    //     // just for fun, let's rotate mr rabbit a little
    //     // delta is 1 if running at 100% performance
    //     // creates frame-independent tranformation
    //     bunny.rotation += 0.1 * delta * (Math.random() * .4);
    // }
}

