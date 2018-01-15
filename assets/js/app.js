// basic confs
var runGame = false,
    scrollSpeed = 20,
    width = 2000,
    height = 2000,
    fieldSize = 30,
    numberOfQuadraticFieldsX = Math.round(width / fieldSize),
    numberOfQuadraticFieldsY = Math.round(height / fieldSize);

var numberOfDummyBunnys = 300;

if(height / fieldSize < numberOfDummyBunnys){
    numberOfDummyBunnys = Math.round(height / fieldSize) - 1;
}
if(width / fieldSize < numberOfDummyBunnys){
    numberOfDummyBunnys = Math.round(height / fieldSize) - 1;
}


// start app
var app = new PIXI.Application(width, height, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

// containers etc
var gameContainer = new PIXI.Container();
app.stage.addChild(gameContainer);

var foodContainer = new PIXI.Container();
gameContainer.addChild(foodContainer);

var unitContainer = new PIXI.Container();
gameContainer.addChild(unitContainer);

var container = new PIXI.Container();
gameContainer.addChild(container);


var config = {
    size: {
        x: numberOfQuadraticFieldsX,
        y: numberOfQuadraticFieldsY
    }
};
var gamefieldGrid = new Grid(config);

// https://github.com/qiao/PathFinding.js
var grid = new PF.Grid(numberOfQuadraticFieldsX, numberOfQuadraticFieldsY);

console.log(gamefieldGrid);
console.log(grid);

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
        // graphics.on('pointerup', defineStartAndTarget);
        // set a fill and line style
        graphics.lineStyle(1, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(
            fieldSize / 2, fieldSize / 2,
            fieldSize, fieldSize);
        graphics.endFill();
        graphics.alpha = 0;

        graphics.width = 20;
        graphics.height = 20;

        graphics.position.x = xPos;
        graphics.position.y = yPos;

        container.addChild(graphics);

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

        // console.log(dummyBunny);

        unitContainer.addChild(dummyBunny);
    }

    runGame = true;
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
var idletime = 9999;
var idleRandomTime = 100 / (numberOfDummyBunnys / 4);
var maxIdleTime = Math.random() * idleRandomTime;

function appLoop(delta) {

    if (runGame) {

        keyboardInteractions();


        for (var index in unitContainer.children) {
            child = unitContainer.children[index];

            // get the food
            if (
                foodContainer.children.length > 0
                && child.idle === true
            ) {
                startObject = child;
                var randomNumber = Math.round(Math.random() * foodContainer.children.length);
                if (foodContainer.children[randomNumber]) {
                    targetPathObject = foodContainer.children[randomNumber];
                    child.gamefield.targetedObject = targetPathObject;
                    child.gamefield.targetPath = defineStartAndTargetDynamic(startObject, targetPathObject);
                }
            }


            child.move(delta);
        }

        // some food movement action
        if (foodContainer.children.length < numberOfDummyBunnys) {
            idletime += 1 * delta;
        }


        // create food
        if (idletime > maxIdleTime
            && foodContainer.children.length < numberOfDummyBunnys) {
            createRandomFood();
            maxIdleTime = Math.random() * idleRandomTime;
            idletime = 0;
        }

    }
}

// todo: source out, maybe DummyContent
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

    if (randomStartX >= numberOfQuadraticFieldsX
        || randomStartY >= numberOfQuadraticFieldsY) {

        createRandomFood();
    } else {

        gamefieldGrid.gamefields[randomStartX][randomStartY].setObject(food);

        foodContainer.addChild(food);
    }
}


function keyboardInteractions() {

    delta = app.ticker.deltaTime;

    if (keyLeftArrow.isDown) {
        gameContainer.position.x = gameContainer.position.x + delta * scrollSpeed;


        if (gameContainer.position.x > 0) {
            gameContainer.position.x = 0;
        }
    }
    if (keyRightArrow.isDown) {
        gameContainer.position.x = gameContainer.position.x - delta * scrollSpeed;

        if (gameContainer.position.x < -width + getWidth()) {
            gameContainer.position.x = gameContainer.position.x + delta * scrollSpeed;
        }
    }
    if (keyUpArrow.isDown) {
        gameContainer.position.y = gameContainer.position.y + delta * scrollSpeed;


        if (gameContainer.position.y > 0) {
            gameContainer.position.y = 0;
        }
    }
    if (keyDownArrow.isDown) {
        gameContainer.position.y = gameContainer.position.y - delta * scrollSpeed;

        if (gameContainer.position.y < -height + getHeight()) {
            gameContainer.position.y = gameContainer.position.y + delta * scrollSpeed;
        }
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