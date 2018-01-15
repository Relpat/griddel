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

    var finder = new PF.AStarFinder({
        allowDiagonal: true
    });

    // define the gridfields
    for (var iteratorX = 0; iteratorX < _gridscope.size.x; iteratorX++) {
        _gridscope.gamefields[iteratorX] = [];
        for (var iteratorY = 0; iteratorY < _gridscope.size.y; iteratorY++) {
            var config = {
                x: iteratorX,
                y: iteratorY
            };
            var gridfield = new Gridfield(config);
            _gridscope.gamefields[iteratorX][iteratorY] = gridfield;
        }
    }

    function getPath(startCoords, endCoords, grid) {
        var startX = startCoords.x,
            startY = startCoords.y,
            endX = endCoords.x,
            endy = endCoords.y;

        var gridComputing = grid.clone(); // clone. Needed, else the maingrid is touched
        var path = finder.findPath(
            startX, startY,
            endX, endy,
            gridComputing
        );

        return path;
    }

    _gridscope.getPath = getPath;
}