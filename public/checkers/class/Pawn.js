/**
 * class Pawn (pion)
 * @param color
 */
define(['config/constants', 'utils/Resource', 'utils/Util'], function(c, Resource, Util) {
    function Pawn (color) {
        var self = this;
        this.selected = false;
        this.again = false;
        this.queen = false;
        this.color = color;
        this.posX = 0;
        this.posY = 0;
        
        this.kineticImg = new Kinetic.Image();
        // add cursor styling
        this.kineticImg.on('mouseover', function() {
          //check si c'est notre couleur de pion et que c'est notre tour
          if (window.player == self.color && window.player == window.turn) {
              document.body.style.cursor = 'pointer';
          }
        });
        this.kineticImg.on('mouseout', function() {
          document.body.style.cursor = 'default';
        });
        this.kineticImg.on('click', function() {
            //check si c'est notre couleur de pion et que c'est notre tour
            if(window.player == self.color && window.player == window.turn) {
                var selectedPawn = window.Map.getSelectedPawn();
                if (!selectedPawn.again && (!selectedPawn || selectedPawn == self)) {
                    if (self.selected == true) {
                        self.selected = false;
                        self.delStroke();
                    } else {
                        self.selected = true;
                        self.setStroke();
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
        var xTileset = 1
        , yTileset = 1;
        if (this.color) {
            xTileset = 2;
            yTileset = 1;
        }
        
        this.kineticImg.setAttrs({
            x: xCanvas,
            y: yCanvas,
            image: Resource.images.RESOURCE_PAWN,
            width: c.WIDTH_PAWN,
            height: c.HEIGHT_PAWN,
            crop: {
                x: (xTileset - 1) * c.WIDTH_PAWN,
                y: (yTileset - 1) * c.HEIGHT_PAWN,
                width: c.WIDTH_PAWN,
                height: c.HEIGHT_PAWN
                }
        });

        window.Map.layerPawn.add(this.kineticImg);
    };
    
    Pawn.prototype.move = function(coordinateClick) {
        var self = this,
        posClick = Util.coordinateToPos(coordinateClick.x, coordinateClick.y, 'pawn'),
        movePossible = this.isMovePossible(posClick);
        if(movePossible != false) {
            this.kineticImg.transitionTo({
                x: coordinateClick.x + c.MARGIN_WIDTH,
                y: coordinateClick.y + c.MARGIN_HEIGHT,
                duration: 1,
                callback: function() {
                    if(!self.again) {
                        self.delStroke();
                    }
                }
            });
            //on modifie sa position dans la grille
            window.Map.grid[this.posY][this.posX] = 0;
            window.Map.grid[posClick[1]][posClick[0]] = this;
            //on modifie ses attributs
            this.posX = posClick[0];
            this.posY = posClick[1];
            if(this.color == 0 && this.posY == 7) {
                this.setQueen();
            } else if(this.color == 1 && this.posY == 0) {
                this.setQueen();
            }
            this.selected = false;
            this.again = false;
            
            //on return false pour un deplacement normal et true si on à mangé
            if (movePossible == true) {
                return false;
            }
            else if (typeof movePossible == 'object') {
                window.maxTurn=25;// si persone ne bouffe en 25 coup fin de game
                movePossible.del();
                return true;
            }
        }
    };
    
    Pawn.prototype.del = function() {
        window.Map.grid[this.posY][this.posX] = 0;
        this.kineticImg.remove();
        window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.setQueen = function() {
        this.queen = true;
        var xTileset = 1
        , yTileset = 3;
        if (this.color) {
            xTileset = 2;
            yTileset = 3;
        }
        this.kineticImg.setCrop({
            x: (xTileset - 1) * c.WIDTH_PAWN,
            y: (yTileset - 1) * c.HEIGHT_PAWN,
            width: c.WIDTH_PAWN,
            height: c.HEIGHT_PAWN
        });
        window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.setStroke = function() {
        var xTileset = 1
        , yTileset = 2;
        if (this.color) {
            xTileset = 2;
        }
        if (this.queen) {
            yTileset = 4;
        }
        this.kineticImg.setCrop({
            x: (xTileset - 1) * c.WIDTH_PAWN,
            y: (yTileset - 1) * c.HEIGHT_PAWN,
            width: c.WIDTH_PAWN,
            height: c.HEIGHT_PAWN
        });
        window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.delStroke = function() {
        var xTileset = 1
        , yTileset = 1;
        if (this.color) {
            xTileset = 2;
        }
        if (this.queen) {
            yTileset = 3;
        }
        this.kineticImg.setCrop({
            x: (xTileset - 1) * c.WIDTH_PAWN,
            y: (yTileset - 1) * c.HEIGHT_PAWN,
            width: c.WIDTH_PAWN,
            height: c.HEIGHT_PAWN
        });
        window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.isMovePossible = function(posClick) {
        var jump = window.Map.mustWeMakeJump(window.turn),
        posX = this.posX,
        posY = this.posY, 
        result = false,
        deplacement = true,
        souffler =  true;
        console.log('mustWeMakeJump:',jump);
        // si c'est un pion de couleur rouge ou si c'est une dame
        if (this.color == 0 || this.queen) {
            // si il faut manger on verifie que le clic soit bon
            if (jump) {
                if(posClick[1] == posY+2 && posClick[0] == posX-2) {
                    result = window.Map.grid[posY+1][posX-1];
                } else if (posClick[1] == posY+2 &&posClick[0] == posX+2) {
                    result = window.Map.grid[posY+1][posX+1];
                } else {
                    //click sur une mauvaise case
                    souffler = false;
                    result = false;
                }
            // sinon on verifie que le deplacement soit correct
            } else if (posClick[1] == posY+1
                && (posClick[0] == posX-1 || posClick[0] == posX+1)
                && window.Map.grid[posClick[1]][posClick[0]] == 0) {
                result = true;
            } else {
                //click sur une mauvaise case  
                deplacement = false;     
                result = false;
            }
        }
        // si c'est un pion de couleur bleu ou si c'est une dame
        if (!result && (this.color == 1  || this.queen)) {
            // si il faut manger on verifie que le clic soit bon
            if (jump) {
                if(posClick[1] == posY-2 && posClick[0] == posX-2) {
                    result = window.Map.grid[posY-1][posX-1];
                } else if (posClick[1] == posY-2 && posClick[0] == posX+2) {
                    result = window.Map.grid[posY-1][posX+1];
                } else {
                    //click sur une mauvaise case
                    souffler = false;
                    result = false;
                }
            // sinon on verifie que le deplacement soit correct
            } else if (posClick[1] == posY-1 
                && (posClick[0] == posX-1 || posClick[0] == posX+1)
                && window.Map.grid[posClick[1]][posClick[0]] == 0) {
                result = true;
            } else {
                //click sur une mauvaise case
                deplacement = false;
                result = false;
            }
        }
        if(!deplacement){
            Util.addAlert("Deplacement impossible", "error");
            
        }else if(!souffler){
             Util.addAlert("Souffler n'est pas jouer", "error");
        }
        else{
            Util.supprAlert();
        }
        return result;
    };
    
    Pawn.prototype.mustPawnMakeJump = function(player) {
        // si c'est un pion de couleur rouge ou si c'est une dame
        if (this.color == player 
                && (this.queen || this.color == 0)) {
            // on regarde si on peut manger en bas à gauche
            if(this.isJumpBL()) {
               return true;
            // on regarde si on peut manger en bas à droite
            } else if (this.isJumpBR()) {
                return true;
            }
        }
        if (this.color == player 
                && (this.queen || this.color == 1)) {
            // on regarde si on peut manger en haut à gauche
            if(this.isJumpTL()) {
               return true;
            // on regarde si on peut manger en haut à droite
            } else if (this.isJumpTR()) {
                return true;
            }
        }
        return false
    };
    
    Pawn.prototype.isJumpBL = function() {
        var posX = this.posX,
        posY = this.posY,
        color = this.color;
        
        if(posY+1 <=7
            && typeof window.Map.grid[posY+1][posX-1] == "object" 
            && window.Map.grid[posY+1][posX-1].color != color 
            && typeof window.Map.grid[posY+2] != "undefined"
            && typeof window.Map.grid[posY+2][posX-2] != "undefined"
            && window.Map.grid[posY+2][posX-2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpBR = function() {
        var posX = this.posX,
        posY = this.posY,
        color = this.color;
        
        if(posY+1 <=7
            && typeof window.Map.grid[posY+1][posX+1] == "object" 
            && window.Map.grid[posY+1][posX+1].color != color 
            && typeof window.Map.grid[posY+2] != "undefined"
            && typeof window.Map.grid[posY+2][posX+2] != "undefined"
            && window.Map.grid[posY+2][posX+2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpTL = function() {
        var posX = this.posX,
        posY = this.posY,
        color = this.color;
        
        if(posY-1 >= 0
            && typeof window.Map.grid[posY-1][posX-1] == "object" 
            && window.Map.grid[posY-1][posX-1].color != color 
            && typeof window.Map.grid[posY-2] != "undefined"
            && typeof window.Map.grid[posY-2][posX-2] != "undefined"
            && window.Map.grid[posY-2][posX-2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpTR = function() {
        var posX = this.posX,
        posY = this.posY,
        color = this.color;
        
        if(posY-1 >= 0
            && typeof window.Map.grid[posY-1][posX+1] == "object" 
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
