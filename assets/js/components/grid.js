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
        try {
            // instantiation

            var startX = startCoords.x,
                startY = startCoords.y,
                endX = endCoords.x,
                endY = endCoords.y;

            if (startX !== null && startY !== null
                && endX !== null && endY !== null
            ) {
                var gridComputing = grid.clone(); // clone. Needed, else the maingrid is touched

                if (gridComputing) {

                    var path = finder.findPath(
                        startX, startY,
                        endX, endY,
                        gridComputing
                    );
                    return path;
                } else {
                    return [];
                }


            } else {
                return [];
            }
        } catch (e) {
            //catchcode
            return [];
            console.debug("\nError:\n", e);
        }

    }

    _gridscope.getPath = getPath;
}