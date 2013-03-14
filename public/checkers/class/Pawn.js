/**
 * class Pawn (pion)
 * @param color
 */
define(['config/constants', 'utils/Resource', 'utils/Util'], function(c, Resource, Util) {
    function Pawn (color) {
        var self = this;
        this.selected = false;
        this.queen = false;
        this.color = color;
        this.posX = 0;
        this.posY = 0;
        
        this.kineticImg = new Kinetic.Image();
        this.kineticImg.on('click', function() {
            //check si c'est notre couleur de pion
            var player = document.cookie.split('=')[1];
            if(player == self.color && player == window.player ) {
                var selectedPawn = window.Map.getSelectedPawn();
                if (!selectedPawn || selectedPawn == self) {
                    if (self.selected == true) {
                        self.selected = false;
                        this.setImage(Resource.images.RESOURCE_PAWN);
                        window.Map.layerPawn.draw();
                    } else {
                        self.selected = true;
                        this.setImage(Resource.images.RESOURCE_PAWN_OVER);
                        window.Map.layerPawn.draw();
                    }
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
                width: c.WIDTH_PAWN,
                height: c.HEIGHT_PAWN,
                crop: {
                    x: 0,
                    y: 0,
                    width: c.WIDTH_PAWN,
                    height: c.HEIGHT_PAWN
                    }
            });
            } else {
                this.kineticImg.setAttrs({
                x: xCanvas,
                y: yCanvas,
                image: Resource.images.RESOURCE_PAWN,
                width: c.WIDTH_PAWN,
                height: c.HEIGHT_PAWN,
                crop: {
                    x: c.WIDTH_PAWN,
                    y: 0,
                    width: c.WIDTH_PAWN,
                    height: c.HEIGHT_PAWN
                }
            });
        }
        window.Map.layerPawn.add(this.kineticImg);
    };
    
    Pawn.prototype.move = function(coordinateClick) {
        var self = this,
        posClick = Util.coordinateToPos(coordinateClick.x, coordinateClick.y),
        movePossible = this.isMovePossible(posClick);
        if(movePossible != false) {
            this.kineticImg.transitionTo({
                x: coordinateClick.x + c.MARGIN_WIDTH,
                y: coordinateClick.y + c.MARGIN_HEIGHT,
                duration: 1,
                callback: function() {
                    self.delStroke();
                }
            });
            //on modifie sa position dans la grille
            window.Map.grid[this.posY][this.posX] = 0;
            window.Map.grid[posClick[1]][posClick[0]] = this;
            //on modifie ses attributs
            this.posX = posClick[0];
            this.posY = posClick[1];
            if(this.color == 0 && this.posY == 7) {
                this.queen = true;
            } else if(this.color == 1 && this.posY == 0) {
                this.queen = true;
            }
            this.selected = false;
        }
        if (movePossible == true) {
            return false;
        }
        else if (typeof movePossible == 'object') {
            movePossible.del();
            return true;
        }
    };
    
    Pawn.prototype.del = function() {
        window.Map.grid[this.posY][this.posX] = 0;
        this.kineticImg.remove();
        window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.delStroke = function() {
        this.kineticImg.setImage(Resource.images.RESOURCE_PAWN);
        window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.isMovePossible = function(posClick) {
        var jump = window.Map.mustWeMakeJump(window.player),
        posX = this.posX,
        posY = this.posY;
        console.log('mustWeMakeJump:',jump);
        // si c'est un pion de couleur rouge ou si c'est une dame
        if (this.color == 0 || this.queen) {
            // si il faut manger on verifie que le clic soit bon
            if (jump) {
                if(posClick[1] == posY+2 && posClick[0] == posX-2) {
                    return window.Map.grid[posY+1][posX-1];
                } else if (posClick[1] == posY+2 &&posClick[0] == posX+2) {
                    return window.Map.grid[posY+1][posX+1];
                } else {
                    //click sur une mauvaise case
                    return false;
                }
            // sinon on verifie que le deplacement soit correct
            } else if (posClick[1] == posY+1
                && (posClick[0] == posX-1 || posClick[0] == posX+1)
                && window.Map.grid[posClick[1]][posClick[0]] == 0) {
                return true;
            } else {
                //click sur une mauvaise case
                return false;
            }
        }
        // si c'est un pion de couleur bleu ou si c'est une dame
        if (this.color == 1  || this.queen) {
            // si il faut manger on verifie que le clic soit bon
            if (jump) {
                if(posClick[1] == posY-2 && posClick[0] == posX-2) {
                    return window.Map.grid[posY-1][posX-1];
                } else if (posClick[1] == posY-2 && posClick[0] == posX+2) {
                    return window.Map.grid[posY-1][posX+1];
                } else {
                    //click sur une mauvaise case
                    return false;
                }
            // sinon on verifie que le deplacement soit correct
            } else if (posClick[1] == posY-1 
                && (posClick[0] == posX-1 || posClick[0] == posX+1)
                && window.Map.grid[posClick[1]][posClick[0]] == 0) {
               return true;
            } else {
                //click sur une mauvaise case
                return false;
            }
        }
    }
    
    Pawn.prototype.isJumpBL = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof window.Map.grid[posY+1][posX-1] == "object" 
            && window.Map.grid[posY+1][posX-1].color != color 
            && typeof window.Map.grid[posY+2] != "undefined"
            && typeof window.Map.grid[posY+2][posX-2] != "undefined"
            && window.Map.grid[posY+2][posX-2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpBR = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof window.Map.grid[posY+1][posX+1] == "object" 
            && window.Map.grid[posY+1][posX+1].color != color 
            && typeof window.Map.grid[posY+2] != "undefined"
            && typeof window.Map.grid[posY+2][posX+2] != "undefined"
            && window.Map.grid[posY+2][posX+2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpTL = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof window.Map.grid[posY-1][posX-1] == "object" 
            && window.Map.grid[posY-1][posX-1].color != color 
            && typeof window.Map.grid[posY-2] != "undefined"
            && typeof window.Map.grid[posY-2][posX-2] != "undefined"
            && window.Map.grid[posY-2][posX-2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpTR = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof window.Map.grid[posY-1][posX+1] == "object" 
            && window.Map.grid[posY-1][posX+1].color != color 
            && typeof window.Map.grid[posY-2] != "undefined"
            && typeof window.Map.grid[posY-2][posX+2] != "undefined"
            && window.Map.grid[posY-2][posX+2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    return Pawn;
}
);
