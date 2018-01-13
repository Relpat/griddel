// basic confs
var width = 1920,
    height = 1080,
    fieldSize = 10,
    numberOfQuadraticFields = 200,
    numberOfQuadraticFieldsX = Math.round(width / fieldSize),
    numberOfQuadraticFieldsY = Math.round(height / fieldSize);

// start app
var app = new PIXI.Application(width, height, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

// containers etc

var foodContainer = new PIXI.Container();
app.stage.addChild(foodContainer);

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

// let the fun beginn!
var bunny;
var baseCoords = {
    x: 5,
    y: 5
};
// some actions
initTestApp();

function initTestApp() {
    function createGridLayout(xIndex, yIndex) {
        var xPos = fieldSize * xIndex;
        var yPos = fieldSize * yIndex;

        var graphics = new PIXI.Graphics();
        // index in gamefield
        graphics.gamefield = [];
        graphics.gamefield.x = xIndex;
        graphics.gamefield.y = yIndex;

        // interactive shit
        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.on('pointerup', defineStartAndTarget);
        // set a fill and line style
        graphics.lineStyle(1, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(
            fieldSize / 2, fieldSize / 2,
            fieldSize, fieldSize);
        graphics.endFill();
        graphics.alpha = 0;

        graphics.position.x = xPos;
        graphics.position.y = yPos;

        container.addChild(graphics);

        return graphics;
    }

    for (var iX = 0; iX < numberOfQuadraticFieldsX; iX++) {
        for (var iY = 0; iY < numberOfQuadraticFieldsY; iY++) {
            var gridGraphicObject = createGridLayout(iX, iY);

            // set object
            var gridField = gamefieldGrid.gamefields[iX][iY];
            gridField.setObject(gridGraphicObject)
        }
    }

    // the dummy-bunny
    bunny = PIXI.Sprite.fromImage('assets/basics/bunny.png');

    var randomStartX = Math.round(Math.random() * numberOfQuadraticFieldsX);
    var randomStartY = Math.round(Math.random() * numberOfQuadraticFieldsY);
    // Set the initial position
    bunny.anchor.set(.5);
    bunny.idle = true;
    bunny.x = fieldSize * randomStartX;
    bunny.y = fieldSize * randomStartY;
    bunny.scale.set(.5, .5);
    bunny.speed = 5;
    bunny.gamefield = [];
    bunny.gamefield.targetPath = [];
    bunny.gamefield.current = gamefieldGrid.gamefields[randomStartX][randomStartY];
    bunny.gamefield.x = randomStartX;
    bunny.gamefield.y = randomStartY;
    bunny.gamefield.nextTarget = bunny.gamefield.current;

    bunny.move = function (delta) {

        if (bunny.gamefield.targetPath.length > 0) {
            if (bunny.idle === true) {
                bunny.idle = false;
            }
            targetObject = bunny.gamefield.targetPath[0].getObject();

            if (
                new Victor(bunny.position.x, bunny.position.y).absDistanceX(new Victor(targetObject.position.x, targetObject.position.y))
                > fieldSize / 20) {
                if (
                    bunny.position.x <
                    targetObject.position.x
                ) {
                    bunny.position.x += bunny.speed * delta;
                } else {
                    bunny.position.x -= bunny.speed * delta;
                }
            }

            if (
                new Victor(bunny.position.x, bunny.position.y).absDistanceY(new Victor(targetObject.position.x, targetObject.position.y))
                > fieldSize / 20) {

                if (
                    bunny.position.y <
                    targetObject.position.y
                ) {
                    bunny.position.y += bunny.speed * delta;
                } else {
                    bunny.position.y -= bunny.speed * delta;
                }
            }

            var distance = getDistance(bunny, targetObject);

            if (distance <= fieldSize / 4) {

                // todo: create setCurrent();
                bunny.gamefield.current = targetObject;

                bunny.gamefield.x = targetObject.gamefield.x;
                bunny.gamefield.y = targetObject.gamefield.y;
                bunny.gamefield.targetPath.shift();

                if (bunny.gamefield.targetPath.length === 0) {
                    foodContainer.removeChildren();
                }
            }
        } else {
            if (bunny.idle === false) {
                bunny.idle = true;
            }
        }
    };

    container.addChild(bunny);
}

function defineStartAndTarget() {
    var endObject = this;

    var startCoords = {
        x: bunny.gamefield.current.gamefield.x,
        y: bunny.gamefield.current.gamefield.y
    };
    var targetCoords = {
        x: endObject.gamefield.x,
        y: endObject.gamefield.y
    };
    var path = gamefieldGrid.getPath(startCoords, targetCoords, grid);

    var pathObjects = [];
    for (var index in path) {
        pathObjects.push(
            gamefieldGrid.gamefields
                [path[index][0]]
                [path[index][1]]
        );
    }

    // set targetPath
    bunny.gamefield.targetPath = pathObjects;

}

function defineStartAndTargetDynamic(startObject, targetObject) {

    var startCoords = {
        x: startObject.gamefield.x,
        y: startObject.gamefield.y
    };
    var targetCoords = {
        x: targetObject.gamefield.x,
        y: targetObject.gamefield.y
    };
    var path = gamefieldGrid.getPath(startCoords, targetCoords, grid);

    var pathObjects = [];
    for (var index in path) {
        pathObjects.push(
            gamefieldGrid.gamefields
                [path[index][0]] // x coords
                [path[index][1]] // y coords
        );
    }
    return pathObjects;
}

app.ticker.add(
    function (delta) {
        appLoop(delta);
    }
);

// Listen for animate update
var idleTime = 9999;
var maxIdleTime = Math.random() * 500;

function appLoop(delta) {
    bunny.move(delta);

    //
    // some food movement action
    if (foodContainer.children.length === 0) {
        idleTime += 1 * delta;
    }
    // get the food
    if (
        foodContainer.children.length >= 1
        && bunny.idle === true
    ) {
        startObject = bunny;
        targetObject = foodContainer.children[0];

        bunny.gamefield.targetPath = defineStartAndTargetDynamic(startObject, targetObject);
    }

    // create food
    if (idleTime > maxIdleTime
        && foodContainer.children.length === 0) {
        createRandomFood();
        maxIdleTime = Math.random() * 500;
        idleTime = 0;
    }
}

function createRandomFood() {
    var food = PIXI.Sprite.fromImage('assets/basics/burger.png');

    var randomStartX = Math.round(Math.random() * numberOfQuadraticFieldsX);
    var randomStartY = Math.round(Math.random() * numberOfQuadraticFieldsY);

    // todo: !important: create interaction object. Pixi.Sprite with additional settings
    food.gamefield = [];
    food.gamefield.x = randomStartX;
    food.gamefield.y = randomStartY;

    // Set the initial position
    food.anchor.set(.5);
    food.x = fieldSize * randomStartX;
    food.y = fieldSize * randomStartY;

    food.scale.set(.1, .1);

    gamefieldGrid.gamefields[randomStartX][randomStartY].setObject(food);

    foodContainer.addChild(food);
}

function getDistance(objectOne, ObjectTwo) {
    var vec1 = new Victor(objectOne.x, objectOne.y);
    var vec2 = new Victor(ObjectTwo.x, ObjectTwo.y);

    return vec1.distanceSq(vec2);
}

