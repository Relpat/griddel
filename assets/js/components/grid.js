/**
 * main app
 *
 * @param configs
 * @constructor
 */
function Grid(configs) {
    _gridscope = this;
    this.size = [];
    this.size.x = 50;
    this.size.y = 50;
    this.gamefields = [];


    for (var config in configs) {
        _gridscope[config] = configs[config];
    }


    // define the gridfields
    for (var iteratorX = 0; iteratorX < _gridscope.size.x; iteratorX++) {
        _gridscope.gamefields[iteratorX] = [];
        for (var iteratorY = 0; iteratorY < _gridscope.size.y; iteratorY++) {
            var config = {
                x : iteratorX,
                y : iteratorY
            };
            var gridfield = new Gridfield(config);
            gridfield.setObject();
            _gridscope.gamefields[iteratorX][iteratorY] = gridfield;
        }
    }


    function getPath(startCoords, endCoords) {
        var startX = startCoords.x,
            startY = startCoords.y,
            endX = endCoords.x,
            endy = endCoords.y;

        var isAbove = false;
        var isRight = false;



        return [
            _gridscope.gamefields[0][0],
            _gridscope.gamefields[0][1]
        ];
    }
    _gridscope.getPath = getPath;
}