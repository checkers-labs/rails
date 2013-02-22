var Util = function(){
	return {
    	getMapJSON: function(name) {
    		var xhr = getXMLHttpRequest();
    		xhr.open("GET", '/checkers/config/maps/' + name + '.json', false);
    		xhr.send(null);
    		if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) {
    			throw new Error("Impossible de charger la carte nommée \"" + name + "\" (code HTTP : " + xhr.status + ").");
    		}
    		return xhr.responseText;
		},
		coordinateToPos: function(x, y) {
			var coordinate = new Array(x/WIDTH_TILE, y/HEIGHT_TILE);
			return coordinate;
		},
		posToCoordinate: function(x, y) {
			var coordinate = new Array(x*WIDTH_TILE, y*HEIGHT_TILE);
			return coordinate;
		}
    };
}();