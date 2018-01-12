function Gridfield(config) {

    // basic configs
    this.x = null;
    this.y = null;
    this.isBlocked = false;

    // vars
    var object;

    /**
     * setter object
     *
     * @param newObject
     */
    this.setObject = function(newObject){
        object = newObject;
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