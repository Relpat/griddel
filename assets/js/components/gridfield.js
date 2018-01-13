function Gridfield(config) {

    _that = this;
    // basic configs
    this.x = null;
    this.y = null;
    this.isBlocked = false;
    // vars
    var object;
    this._object = object;

    /**
     * setter object
     *
     * @param newObject
     */
    this.setObject = function(newObject){
        object = newObject;
        _that._object = object;
    }

    /**
     * getter object
     *
     * @returns {*}
     */
    this.getObject = function () {
        return object;
    }

    /**
     * delete object
     */
    this.deleteObject = function () {
        object = null;
    }
}