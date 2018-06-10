function Gridfield(config) {
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
        this._object = newObject;
        this.isBlocked = false;
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
        object.parent.removeChild(object); // remove from container

        // reset this
        this._object = null;
        object = null;
        this.isBlocked = false;
    }

    /**
     *
     */
    this.hasObject = function () {
        if(object){
            return true;
        }else{
            return false;
        }
    }
}