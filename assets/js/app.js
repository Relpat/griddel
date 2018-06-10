// code...
var meter = new FPSMeter();

// basic confs
var scrollSpeed = 20,
    width = 500,
    height = 500,
    fieldSize = 30,
    numberOfQuadraticFieldsX = Math.round(width / fieldSize),
    numberOfQuadraticFieldsY = Math.round(height / fieldSize);
var buildingMode = false;
var lastVisitedGamefields = [];

// dummythings
var numberOfDummyBunnys = 5;
var gameIdletime = 9999;
var idleRandomTime = 100 / (numberOfDummyBunnys / 4);
var idleRandomTime = 100;
var maxIdleTime = Math.random() * idleRandomTime;

var currentChosenBuilding = 0;


// start app
var app = new PIXI.Application(width, height, {backgroundColor: 0x1099bb});
app.ticker.stop();
document.body.appendChild(app.view);

// containers etc
var gameContainer = new PIXI.Container();
app.stage.addChild(gameContainer);

var foodContainer = new PIXI.Container();
gameContainer.addChild(foodContainer);

var unitContainer = new PIXI.Container();
gameContainer.addChild(unitContainer);

var gridContainer = new PIXI.Container();
gameContainer.addChild(gridContainer);


var config = {
    size: {
        x: numberOfQuadraticFieldsX,
        y: numberOfQuadraticFieldsY
    }
};
var gamefieldGrid = new Grid(config);

// https://github.com/qiao/PathFinding.js
var grid = new PF.Grid(numberOfQuadraticFieldsX, numberOfQuadraticFieldsY);

// ###################
// let the fun beginn!


// some actions
initTestApp();

function initTestApp() {

    function createGridTouchObject(xIndex, yIndex) {
        var xPos = fieldSize * xIndex;
        var yPos = fieldSize * yIndex;

        var graphics = new PIXI.Graphics();
        // index in gamefield
        graphics.gamefield = [];
        graphics.gamefield.x = xIndex;
        graphics.gamefield.y = yIndex;

        // interactive shit
        // graphics.interactive = true;
        // graphics.buttonMode = true;
        graphics.on('mouseout', hideLastVisitedFields);
        graphics.on('pointerover', showBuildingPosition);
        graphics.on('click', buildBuilding);
        // set a fill and line style
        // graphics.lineStyle(1, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(
            0, 0,
            fieldSize, fieldSize);
        graphics.endFill();
        graphics.alpha = 0;

        graphics.width = fieldSize;
        graphics.height = fieldSize;

        graphics.position.x = xPos;
        graphics.position.y = yPos;

        gridContainer.addChild(graphics);

        return graphics;
    }

    for (var iX = 0; iX < numberOfQuadraticFieldsX; iX++) {
        for (var iY = 0; iY < numberOfQuadraticFieldsY; iY++) {
            var gridGraphicObject = createGridTouchObject(iX, iY);

            // set object
            var gridField = gamefieldGrid.gamefields[iX][iY];
            gridField.setObject(gridGraphicObject)
        }
    }

    var dummySpritePath = 'assets/basics/bunny.png';
    for (var index = 0; index < numberOfDummyBunnys; index++) {
        var dummyBunny = new BaseModel(dummySpritePath);
        dummyBunny.createRandomConfigs();

        unitContainer.addChild(dummyBunny);
    }


    currentChosenBuilding = new BaseBuilding(dummySpritePath);


    app.ticker.start();
}

// todo: source out, maybe ???
function defineStartAndTarget(unit) {
    var endObject = this;

    var startCoords = {
        x: unit.gamefield.current.gamefield.x,
        y: unit.gamefield.current.gamefield.y
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
    unit.gamefield.targetPath = pathObjects;

}

// todo: source out, maybe ???
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

function appLoop(delta) {
    meter.tick();

    keyboardInteractions();

    for (var index in unitContainer.children) {
        unit = unitContainer.getChildAt(index);

        // get the food
        if (
            foodContainer.children.length > 0
            && unit.idle === true
        ) {
            var randomNumber = getRandomInt(0,foodContainer.children.length);
            if (foodContainer.children[randomNumber]) {
                targetPathObject = foodContainer.getChildAt(randomNumber);

                unit.gamefield.targetedObject = targetPathObject;
                var path =  defineStartAndTargetDynamic(unit, targetPathObject);
                unit.gamefield.targetPath = path;
            }
        }

        unit.move(showPath = true);
    }


    // some food movement action
    if (foodContainer.children.length < numberOfDummyBunnys) {
        gameIdletime += 1 * delta;
    }


    // create food
    if (gameIdletime > maxIdleTime
        && foodContainer.children.length < numberOfDummyBunnys) {
        createRandomFood();
        maxIdleTime = Math.random() * idleRandomTime;
        gameIdletime = 0;
    }

}

// todo: source out, maybe DummyContents
function createRandomFood() {
    var food = PIXI.Sprite.fromImage('assets/basics/burger.png');

    var randomStartX = createRandomPosX();
    var randomStartY = createRandomPosY();

    // todo: !important: create interaction object. Pixi.Sprite with additional settings
    food.gamefield = [];
    food.gamefield.x = randomStartX;
    food.gamefield.y = randomStartY;

    // Set the initial position
    // food.anchor.set(0.5);
    food.x = fieldSize * randomStartX;
    food.y = fieldSize * randomStartY;

    food.scale.set(.25, .25);

    if (randomStartX >= numberOfQuadraticFieldsX
        || randomStartY >= numberOfQuadraticFieldsY
    ) {
        createRandomFood();
    } else {

        if (gamefieldGrid.gamefields[randomStartX][randomStartY].isBlocked) {
            createRandomFood();
        }
        gamefieldGrid.gamefields[randomStartX][randomStartY].isBlocked = true;

        foodContainer.addChild(food);
    }
}


function getHeight() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    return y;
}

function getWidth() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth;

    return x;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomPosX() {
    return getRandomInt(0, (numberOfQuadraticFieldsX - 1))
}

function createRandomPosY() {
    return getRandomInt(0, (numberOfQuadraticFieldsY - 1))
}