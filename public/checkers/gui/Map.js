/**
 * Singleton Map : 
 * 	Dessine le damier contenu dans le json
 * 	Tableau contenant tous les pions ainsi que les couleurs des cases : 
 * 		0 ==> noir
 * 		1 ==> blanc
 */
var Map = new function() {
	var self = this;
	this.mapData = JSON.parse(Util.getMapJSON("damier"));
	
	this.layerMap = new Kinetic.Layer();
	this.layerPawn = new Kinetic.Layer();
	
	this.init = function() {
		this.grid = new Array(8,8);
		this.grid[0] = new Array(new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1);
		this.grid[1] = new Array(1, new Pawn(0), 1,new Pawn(0), 1, new Pawn(0), 1, new Pawn(0));
		this.grid[2] = new Array(new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1);
		this.grid[3] = new Array(1, 0, 1, 0, 1, 0, 1, 0);
		this.grid[4] = new Array(0, 1, 0, 1, 0, 1, 0, 1);
		this.grid[5] = new Array(1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1));
		this.grid[6] = new Array(new Pawn(1), 1,new Pawn(1), 1, new Pawn(1), 1, new Pawn(1), 1);
		this.grid[7] = new Array(1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1));
	};
	
	/**
	 * dessine le damier
	 */
	this.drawMap = function() {
		for(var i = 0, l = this.mapData.map.length ; i < l ; i++) {
			for(var j = 0, k = this.mapData.map[i].length ; j < k ; j++) {
				var coordinate = Util.posToCoordinate(j, i);
				var xTileset = (this.mapData.map[i][j]-1)*WIDTH_TILE;
				var tileset = new Kinetic.Image({
				     x: coordinate[0],
				     y: coordinate[1],
				     image: Resource.images.RESOURCE_TILE,
				     width: WIDTH_TILE,
				     height: HEIGHT_TILE,
				     crop: {
				     	 x: xTileset,
				         y: 0,
				         width: WIDTH_TILE,
				         height: HEIGHT_TILE
				     }
				  });
				
				tileset.on('click', function() {
			    	var selectedPawn = self.getSelectedPawn();
			    	console.log('selectedPawn:',selectedPawn);
			    	if (!selectedPawn) {
			    		console.log('no selected pawn');
			    	} else {
			    	    var posClick = Util.coordinateToPos(this.getX(), this.getY());
			    	    console.log('posClick:',posClick);
			    	    console.log('gridClick:',self.grid[posClick[1]][posClick[0]]);
			    	    
			    	    var jump = self.mustWeMakeJump();
			    	    console.log('mustWeMakeJump:',jump);
			    	    var move = self.isMovePossible(jump, selectedPawn, posClick);
			    	    if (move == true) {
			    	        selectedPawn.move(this.getX(), this.getY());
			    	    } else if (typeof move == 'object') {
	                        console.log('jumpedPawn',move);
			    	        selectedPawn.move(this.getX(), this.getY());
			    	        move.del();
			    	    }
			    	}
			    });
				
				this.layerMap.add(tileset);
			}
		}
	};
	
	this.drawGrid = function() {		
		for(var i = 0, l = this.grid.length ; i < l ; i++) {
			for(var j = 0, k = this.grid[i].length ; j < k ; j++) {
				//si il y a un pion
				if (typeof this.grid[i][j] == "object") {
					var coordinate = Util.posToCoordinate(j, i);
					//on set sa position
					this.grid[i][j].posX = j;
					this.grid[i][j].posY = i;
					//on le dessine
					this.grid[i][j].draw(coordinate[0] + MARGIN_WIDTH, coordinate[1] + MARGIN_HEIGHT);
				}
			}
		}
	};
	
	this.getSelectedPawn = function() {
		for(var i = 0, l = this.grid.length ; i < l ; i++) {
			for(var j = 0, k = this.grid[i].length ; j < k ; j++) {
				//si il y a un pion et que son attribut selected == true
				if (typeof this.grid[i][j] == "object" && this.grid[i][j].selected == true) {
					return this.grid[i][j];
				}
			}
		}
		return false;
	};
	
	this.mustWeMakeJump = function() {
	    for(var i = 0, l = this.grid.length ; i < l ; i++) {
            for(var j = 0, k = this.grid[i].length ; j < k ; j++) {
                //si il y a un pion
                if (typeof this.grid[i][j] == "object") {
                    var selectedPawn = this.grid[i][j];
                    var posX = selectedPawn.posX;
                    var posY = selectedPawn.posY;
                    // si c'est un pion de couleur rouge ou si c'est une dame
                    if (selectedPawn.color == 0 || selectedPawn.queen) {
                        // on regarde si on peut manger en bas à gauche
                        if(selectedPawn.isJumpBL(posX, posY)) {
                           return true;
                        // on regarde si on peut manger en bas à droite
                        } else if (selectedPawn.isJumpBR(posX, posY)) {
                            return true;
                        }
                    }
                    if (selectedPawn.color == 1 || selectedPawn.queen) {
                        // on regarde si on peut manger en haut à gauche
                        if(selectedPawn.isJumpTL(posX, posY)) {
                           return true;
                        // on regarde si on peut manger en haut à droite
                        } else if (selectedPawn.isJumpTR(posX, posY)) {
                            return true;
                        }
                    }
                }
            }
        }
	    return false;
	}
	
	this.isMovePossible = function(jump, selectedPawn, posClick) {
	    var posX = selectedPawn.posX;
        var posY = selectedPawn.posY;
        // si c'est un pion de couleur rouge ou si c'est une dame
        if (selectedPawn.color == 0 || selectedPawn.queen) {
            // si il faut manger on verifie que le clic soit bon
            if (jump) {
                if(posClick[1] == posY+2 && posClick[0] == posX-2) {
                    return this.grid[posY+1][posX-1];
                } else if (posClick[1] == posY+2 &&posClick[0] == posX+2) {
                    return this.grid[posY+1][posX+1];
                } else {
                    //click sur une mauvaise case
                    return false;
                }
            // sinon on verifie que le deplacement soit correct
            } else if (posClick[1] == posY+1
                && this.grid[posClick[1]][posClick[0]] == 0) {
                return true;
            } else {
                //click sur une mauvaise case
                return false;
            }
        }
        // si c'est un pion de couleur bleu ou si c'est une dame
        if (selectedPawn.color == 1  || selectedPawn.queen) {
            // si il faut manger on verifie que le clic soit bon
            if (jump) {
                if(posClick[1] == posY-2 && posClick[0] == posX-2) {
                    return this.grid[posY-1][posX-1];
                } else if (posClick[1] == posY-2 && posClick[0] == posX+2) {
                    return this.grid[posY-1][posX+1];
                } else {
                    //click sur une mauvaise case
                    return false;
                }
            // sinon on verifie que le deplacement soit correct
            } else if (posClick[1] == posY-1 
                && this.grid[posClick[1]][posClick[0]] == 0) {
               return true;
            } else {
                //click sur une mauvaise case
                return false;
            }
        }
    };
	
	/**
	 * retourne la hauteur
	 * @returns
	 */
	this.getHeight = function() {
		return this.mapData.map.length;
	};

	/**
	 * retourne la largeur
	 * @returns
	 */
	this.getWidth = function() {
		return this.mapData.map[0].length;
	};
};