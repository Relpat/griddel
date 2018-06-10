/**
 *
 * @param texture
 * @param additionalConfiguration
 * @constructor
 */
BaseBuilding = function (texture, additionalConfiguration) {
    var pixiTexture = new PIXI.Texture.fromImage(texture);
    PIXI.Sprite.call(this, pixiTexture);

    this.config = [];
    this.gamefield = [];
    this.gamefield = {
        x: 0,
        y: 0,
    };
    this.building = [];
    this.building = {
        form: [
            {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
            {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}
        ],
        sqSize : 4,
    };
    this.setSqSize(10);
    this.idle = true;
    this.speed = 0;
    this.isBuildable = false;

    for (var index in additionalConfiguration) {
        this.config[index] = additionalConfiguration[index];
    }
};

BaseBuilding.prototype = Object.create(PIXI.Sprite.prototype);
BaseBuilding.prototype.constructor = BaseBuilding;

BaseBuilding.prototype.setSqSize = function (size) {
    this.building.form = [];
    this.building.sqSize = size;
    for (var indexX = 0; indexX < size; indexX++) {
        for (var indexY = 0; indexY < size; indexY++) {
            this.building.form.push({x: indexX, y: indexY});
        }
    }
};


// interactive things
function showBuildingPosition() {
    currentField = this;
    var form = currentChosenBuilding.building.form;
    currentChosenBuilding.isBuildable = true;
    for (var index in form) {
        var coordsX = this.gamefield.x + form[index].x;
        var coordsY = this.gamefield.y + form[index].y;
        if (coordsX >= 0 && coordsY >= 0
            && coordsX < numberOfQuadraticFieldsX
            && coordsY < numberOfQuadraticFieldsY
        ) {
            var field = gamefieldGrid.gamefields[coordsX][coordsY].getObject();
            if (field.isBlocked) {
                currentChosenBuilding.isBuildable = false;
                break;
            }
        }
    }
    for (var index in form) {
        var coordsX = this.gamefield.x + form[index].x;
        var coordsY = this.gamefield.y + form[index].y;
        if (coordsX >= 0 && coordsY >= 0
            && coordsX < numberOfQuadraticFieldsX
            && coordsY < numberOfQuadraticFieldsY
        ) {
            var field = gamefieldGrid.gamefields[coordsX][coordsY].getObject();
            if (field) {
                if (currentChosenBuilding.isBuildable) {
                    field.alpha = 0.65;
                } else {
                    if (!field.isBlocked) {
                        field.alpha = 0.35;
                    }
                }
            }
            lastVisitedGamefields.push(field);
        }
    }
}

function hideLastVisitedFields() {

    for (var index in lastVisitedGamefields) {
        var field = lastVisitedGamefields[index];
        if (field) {
            if (!field.isBlocked) {
                // is field not blocked
                field.alpha = 0;
            }
        }
    }
    lastVisitedGamefields = [];
}

function buildBuilding() {

    if (currentChosenBuilding.isBuildable) {

        currentField = this;
        var form = currentChosenBuilding.building.form;

        for (var index in form) {
            var coordsX = this.gamefield.x + form[index].x;
            var coordsY = this.gamefield.y + form[index].y;
            if (coordsX >= 0 && coordsY >= 0) {
                var field = gamefieldGrid.gamefields[coordsX][coordsY].getObject();
                if (field) {
                    field.isBlocked = true;
                    field.alpha = 1;
                }

                grid.setWalkableAt(coordsX, coordsY, false);
            }
        }

        hideLastVisitedFields();

    }
}