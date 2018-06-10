/**
 * todo: create and complete inheritable functions, configs and stats
 *
 * @constructor
 */

BaseModel = function (texture, additionalConfiguration) {
    var pixiTexture = new PIXI.Texture.fromImage(texture);
    PIXI.Sprite.call(this, pixiTexture);

    this.config = [];
    this.gamefield = [];
    this.gamefield = {
        x: 0,
        y: 0,
        targetPath: [],
        current: gamefieldGrid.gamefields[0][0],
        nextTarget: gamefieldGrid.gamefields[0][0]
    };
    this.idle = true;
    this.idleTime = 0;
    this.maxIdletime = 500;
    this.speed = 2;

    // pathline
    this.pathline = null;

    this.lastPosition = this.position;


    // graphic
    // this.anchor.set(.5);
    for (var index in additionalConfiguration) {
        this.config[index] = additionalConfiguration[index];
    }
};

BaseModel.prototype = Object.create(PIXI.Sprite.prototype);
BaseModel.prototype.constructor = BaseModel;

// random things
BaseModel.prototype.createRandomConfigs = function () {
    var randomStartX = createRandomPosX();
    var randomStartY = createRandomPosY();

    this.gamefield.x = randomStartX;
    this.gamefield.y = randomStartY;
    this.x = randomStartX;
    this.y = randomStartY;
    this.position.x = randomStartX * fieldSize;
    this.position.y = randomStartY * fieldSize;
    this.lastPosition = this.position;
    // this.scale.set(.5, .5);
    this.speed = 2 * getRandomInt(2, 5);
};

// move function
BaseModel.prototype.move = function (showPath) {
    var delta = app.ticker.deltaTime;

    // idle-time
    if (this.position.x === this.lastPosition.x
        && this.position.y === this.lastPosition.y) {
        this.idleTime += delta;
    } else {
        this.idleTime = 0;
    }
    this.lastPosition = new PIXI.Point(this.position.x, this.position.y);

    if (this.idleTime > this.maxIdletime) {
        console.log("reset");
        this.gamefield.targetPath = [];
        this.idle = true;
        this.targetedObject = null;
        this.idleTime = 0;
    }

    if (this.gamefield.targetPath.length > 0) {
        if (this.idle === true) {
            this.idle = false;
        }

        targetPathObject = this.gamefield.targetPath[0].getObject(); // get first object
        if (targetPathObject) {

            if (showPath) {
                if (this.children.length > 0) {
                    // update
                    pathline = this.getChildAt(0);
                    pathline.clear();
                    pathline.moveTo(0, 0);
                    pathline.lineStyle(1, 0xffd900, 1);

                    var target = new PIXI.Point(
                        this.worldTransform.tx,
                        this.worldTransform.ty
                    );
                    var targetPos = this.toLocal(
                        target,
                        this.gamefield.targetedObject
                    );

                    pathline.lineTo(
                        targetPos.x,
                        targetPos.y
                    );

                } else {
                    // create
                    var pathline = new PIXI.Graphics();

                    pathline.lineStyle(4, 0xffd900, 1);

                    pathline.moveTo(0, 0);
                    pathline.lineTo(
                        this.gamefield.targetedObject.position.x,
                        this.gamefield.targetedObject.position.y
                    );
                    pathline.endFill();

                    this.addChild(pathline);
                }

            }

            var vectorUnit = new Victor(this.position.x, this.position.y);
            var vectorTarget = new Victor(targetPathObject.position.x, targetPathObject.position.y);
            var speed = this.speed * delta;


            // sweeping collision
            var distanceY = vectorUnit.absDistanceY(vectorTarget),
                timeY = distanceY / speed;

            var distanceX = vectorUnit.absDistanceX(vectorTarget),
                timeX = distanceX / speed;


            // todo: DO A BETTER COLLISION-DETECTION, pls...
            if (
                timeX > 1) {
                if (
                    this.position.x <
                    targetPathObject.position.x
                ) {
                    this.position.x += speed;
                } else {
                    this.position.x -= speed;
                }
            }


            if (
                timeY > 1) {
                if (
                    this.position.y <
                    targetPathObject.position.y
                ) {
                    this.position.y += speed;
                } else {
                    this.position.y -= speed;
                }
            }


            // is on same field
            if (timeY >= 0 && timeY <= 1
                &&
                timeX >= 0 && timeX <= 1
            ) {
                this.gamefield.current = targetPathObject;

                this.gamefield.x = targetPathObject.gamefield.x;
                this.gamefield.y = targetPathObject.gamefield.y;

                this.gamefield.targetPath.shift();
            }


            if (this.gamefield.targetedObject) {
                if (
                    this.gamefield.x === this.gamefield.targetedObject.gamefield.x
                    && this.gamefield.y === this.gamefield.targetedObject.gamefield.y) {

                    this.gamefield.targetPath = [];
                    if (this.gamefield.targetedObject) {
                        if (this.gamefield.targetedObject.parent) {
                            this.gamefield.targetedObject.parent.removeChild(this.gamefield.targetedObject);
                            gamefieldGrid.gamefields[this.gamefield.targetedObject.gamefield.x][this.gamefield.targetedObject.gamefield.y].isBlocked = false;
                        }
                    }

                }
            }
            // if (this.gamefield.targetPath.length < numberOfDummyBunnys) {
            // foodContainer.removeChildren();

            if (this.gamefield.targetPath.length === 0) {
                this.idle = true;

                if (this.pathline) {
                    this.children.removeAll()
                }
            }
        } else {
            this.idle = true;
        }

    } else {
        // all done? Get ready 4 next work
        if (this.idle === false) {
            this.idle = true;
        }
    }
};


// todo: complete
BaseModel.prototype.animate = function () {

};