/**
 * class Pawn (pion)
 * @param color
 */
function Pawn (color) {
	var self = this;
	this.selected = false;
	this.queen = false;
	this.color = color;
    this.posX = 0;
    this.posY = 0;
    
    this.kineticImg = new Kinetic.Image();
    this.kineticImg.on('click', function() {
    	var selectedPawn = Map.getSelectedPawn();
    	if (!selectedPawn || selectedPawn == self) {
	    	if (self.selected == true) {
	    		self.selected = false;
	        	this.setStroke('');
	    		this.setStrokeWidth(0);
	    		Map.layerPawn.draw();
	    	} else {
	    		self.selected = true;
	        	this.setStroke('yellow');
	    		this.setStrokeWidth(4);
	    		Map.layerPawn.draw();
	    	}
    	}
    });
}

/**
 * dessine le pion
 * @param xCanvas
 * @param yCanvas
 */
Pawn.prototype.draw = function(xCanvas, yCanvas) {
	if (this.color) {
		this.kineticImg.setAttrs({
			x: xCanvas,
		    y: yCanvas,
		    image: Resource.images.RESOURCE_PAWN,
		    width: WIDTH_PAWN,
		    height: HEIGHT_PAWN,
		    crop: {
		        x: 0,
		        y: 0,
		        width: WIDTH_PAWN,
		        height: HEIGHT_PAWN
		    }
		});
	} else {
		this.kineticImg.setAttrs({
			x: xCanvas,
		    y: yCanvas,
		    image: Resource.images.RESOURCE_PAWN,
		    width: WIDTH_PAWN,
		    height: HEIGHT_PAWN,
		    crop: {
		        x: WIDTH_PAWN,
		        y: 0,
		        width: WIDTH_PAWN,
		        height: HEIGHT_PAWN
		    }
		});
	}
	Map.layerPawn.add(this.kineticImg);
};

Pawn.prototype.move = function(x, y) {
    var self = this;

    this.kineticImg.transitionTo({
        x: x + MARGIN_WIDTH,
        y: y + MARGIN_HEIGHT,
        duration: 1,
        callback: function() {
            self.delStroke();
        }
    });
    var coordinate = Util.coordinateToPos(x, y);
    //on modifie sa position dans la grille
    Map.grid[this.posY][this.posX] = 0;
    Map.grid[coordinate[1]][coordinate[0]] = this;
    //on modifie ses attributs
    this.posX = coordinate[0];
    this.posY = coordinate[1];
    this.selected = false;
};

Pawn.prototype.del = function() {
    Map.grid[this.posY][this.posX] = 0;
    this.kineticImg.remove();
    Map.layerPawn.draw();
};

Pawn.prototype.delStroke = function() {
	this.kineticImg.setStroke('');
	this.kineticImg.setStrokeWidth(0);
	Map.layerPawn.draw();
};

Pawn.prototype.isJumpBL = function(posX, posY) {
    if(typeof Map.grid[posY+1][posX-1] == "object" 
        && Map.grid[posY+1][posX-1].color == 1 
        && typeof Map.grid[posY+2] != "undefined"
        && typeof Map.grid[posY+2][posX-2] != "undefined"
        && Map.grid[posY+2][posX-2] == 0) {
        return true;
    } else {
        return false;
    }
};

Pawn.prototype.isJumpBR = function(posX, posY) {
    if(typeof Map.grid[posY+1][posX+1] == "object" 
        && Map.grid[posY+1][posX+1].color == 1 
        && typeof Map.grid[posY+2] != "undefined"
        && typeof Map.grid[posY+2][posX+2] != "undefined"
        && Map.grid[posY+2][posX+2] == 0) {
        return true;
    } else {
        return false;
    }
};

Pawn.prototype.isJumpTL = function(posX, posY) {
    if(typeof Map.grid[posY-1][posX-1] == "object" 
        && Map.grid[posY-1][posX-1].color == 0 
        && typeof Map.grid[posY-2] != "undefined"
        && typeof Map.grid[posY-2][posX-2] != "undefined"
        && Map.grid[posY-2][posX-2] == 0) {
        return true;
    } else {
        return false;
    }
};

Pawn.prototype.isJumpTR = function(posX, posY) {
    if(typeof Map.grid[posY-1][posX+1] == "object" 
        && Map.grid[posY-1][posX+1].color == 0 
        && typeof Map.grid[posY-2] != "undefined"
        && typeof Map.grid[posY-2][posX+2] != "undefined"
        && Map.grid[posY-2][posX+2] == 0) {
        return true;
    } else {
        return false;
    }
};