function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

// http://keycode.info/
// camera
let keyLeftArrow = keyboard(37);
let keyUpArrow = keyboard(38);
let keyRightArrow = keyboard(39);
let keyDownArrow = keyboard(40);

let keyW = keyboard(87);
let keyA = keyboard(65);
let keyS = keyboard(83);
let keyD = keyboard(68);

let keySpace = keyboard(32);
let keyNumAdd  = keyboard(107);
let keyNumSubstract = keyboard(109);
let keyNum9 = keyboard(105);

keyNumAdd.press = () => {
  currentChosenBuilding.building.sqSize++;
  currentChosenBuilding.setSqSize(currentChosenBuilding.building.sqSize)
};

// toggle building-mode
keyNumSubstract.press = () => {
  currentChosenBuilding.building.sqSize--;
  if( currentChosenBuilding.building.sqSize < 1){
      currentChosenBuilding.building.sqSize = 1;
  }
  currentChosenBuilding.setSqSize(currentChosenBuilding.building.sqSize)
};

// random food spawn
keyNum9.press = () => {
    createRandomFood();
};


// Keyboard interactions
function keyboardInteractions() {
    delta = app.ticker.deltaTime;

    // camera-movement
    if (keyLeftArrow.isDown || keyA.isDown) {
        gameContainer.position.x = gameContainer.position.x + delta * scrollSpeed;

        if (gameContainer.position.x > 0) {
            gameContainer.position.x = 0;
        }
    }
    if (keyRightArrow.isDown || keyD.isDown) {
        gameContainer.position.x = gameContainer.position.x - delta * scrollSpeed;

        if (gameContainer.position.x < -width + getWidth()) {
            gameContainer.position.x = gameContainer.position.x + delta * scrollSpeed;
        }
    }
    if (keyUpArrow.isDown || keyW.isDown) {
        gameContainer.position.y = gameContainer.position.y + delta * scrollSpeed;

        if (gameContainer.position.y > 0) {
            gameContainer.position.y = 0;
        }
    }
    if (keyDownArrow.isDown || keyS.isDown) {
        gameContainer.position.y = gameContainer.position.y - delta * scrollSpeed;

        if (gameContainer.position.y < -height + getHeight()) {
            gameContainer.position.y = gameContainer.position.y + delta * scrollSpeed;
        }
    }
}

// building mode
keySpace.press = () => {
    buildingMode = !buildingMode;

    if (buildingMode) {
        app.renderer.backgroundColor = 0x57b7cf;
    } else {
        app.renderer.backgroundColor = 0x1099bb;
    }


    for (var index in gridContainer.children) {
        var field = gridContainer.getChildAt(index);

        field.interactive = buildingMode;
        field.buttonMode = buildingMode;
    }
}


