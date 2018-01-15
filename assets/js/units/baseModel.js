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
    this.speed = 2;


    // graphic
    this.anchor.set(.5);

    for (var index in additionalConfiguration) {
        this.config[index] = additionalConfiguration[index];
    }
};
BaseModel.prototype = Object.create(PIXI.Sprite.prototype);
BaseModel.prototype.constructor = BaseModel;

// random things
BaseModel.prototype.createRandomConfigs = function () {
    var randomStartX = Math.round(Math.random() * numberOfQuadraticFieldsX);
    var randomStartY = Math.round(Math.random() * numberOfQuadraticFieldsY);

    this.gamefield.x = randomStartX;
    this.gamefield.y = randomStartY;
    this.x = randomStartX;
    this.y = randomStartY;
    this.scale.set(.5, .5);
    this.speed = 2 * Math.round(Math.random() + 5);

    console.log("random!");
};

// move function
BaseModel.prototype.move = function (delta) {

    if (this.gamefield.targetPath.length > 0) {
        if (this.idle === true) {
            this.idle = false;
        }

        targetPathObject = this.gamefield.targetPath[0].getObject();
        if (targetPathObject) {

            var vectorUnit = new Victor(this.position.x, this.position.y);
            var vectorTarget = new Victor(targetPathObject.position.x, targetPathObject.position.y);

            // var distance = vectorUnit.distanceSq(vectorTarget);

            // todo: DO A BETTER COLLISION-DETECTION, pls...
            if (
                vectorUnit.absDistanceX(vectorTarget)
                > fieldSize) {
                if (
                    this.position.x <
                    targetPathObject.position.x
                ) {
                    this.position.x += this.speed * delta;
                } else {
                    this.position.x -= this.speed * delta;
                }
            }

            if (
                vectorUnit.absDistanceY(vectorTarget)
                > fieldSize) {

                if (
                    this.position.y <
                    targetPathObject.position.y
                ) {
                    this.position.y += this.speed * delta;
                } else {
                    this.position.y -= this.speed * delta;
                }
            }

            /*
            Collision detection
            and remove target
             */
            if (
                this.position.x < targetPathObject.position.x + targetPathObject.width &&
                this.position.x + this.width > targetPathObject.position.x &&
                this.position.y < targetPathObject.position.y + targetPathObject.height &&
                this.height + this.position.y > targetPathObject.position.y) {
                // collision detected!

                // todo: create setCurrent();
                this.gamefield.current = targetPathObject;

                this.gamefield.x = targetPathObject.gamefield.x;
                this.gamefield.y = targetPathObject.gamefield.y;
                this.gamefield.targetPath.shift();

                if (this.gamefield.targetedObject) {
                    if (
                        this.gamefield.x === this.gamefield.targetedObject.gamefield.x
                        && this.gamefield.y === this.gamefield.targetedObject.gamefield.y) {

                        this.gamefield.targetPath = [];
                        if (this.gamefield.targetedObject) {
                            if (this.gamefield.targetedObject.parent) {
                                this.gamefield.targetedObject.parent.removeChild(this.gamefield.targetedObject)
                            }
                        }


                    }
                }
            }
            // if (this.gamefield.targetPath.length < numberOfDummyBunnys) {
            // foodContainer.removeChildren();

            if (this.gamefield.targetPath.length === 0) {
                this.idle = true;
            }
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