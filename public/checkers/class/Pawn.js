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
            if(player == self.color && player == Window.turn ) {
                var selectedPawn = Window.Map.getSelectedPawn();
                if (!selectedPawn || selectedPawn == self) {
                    if (self.selected == true) {
                        self.selected = false;
                        this.setImage(Resource.images.RESOURCE_PAWN_OVER);
                        Window.Map.layerPawn.draw();
                    } else {
                        self.selected = true;
                        this.setImage(Resource.images.RESOURCE_PAWN_OVER);
                        Window.Map.layerPawn.draw();
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
        Window.Map.layerPawn.add(this.kineticImg);
    };
    
    Pawn.prototype.move = function(x, y) {
        var self = this;
    
        this.kineticImg.transitionTo({
            x: x + c.MARGIN_WIDTH,
            y: y + c.MARGIN_HEIGHT,
            duration: 1,
            callback: function() {
                self.delStroke();
            }
        });
        var coordinate = Util.coordinateToPos(x, y);
        //on modifie sa position dans la grille
        Window.Map.grid[this.posY][this.posX] = 0;
        Window.Map.grid[coordinate[1]][coordinate[0]] = this;
        //on modifie ses attributs
        this.posX = coordinate[0];
        this.posY = coordinate[1];
        this.selected = false;
    };
    
    Pawn.prototype.del = function() {
        Window.Map.grid[this.posY][this.posX] = 0;
        this.kineticImg.remove();
        Window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.delStroke = function() {
        this.kineticImg.setImage(Resource.images.RESOURCE_PAWN);
        Window.Map.layerPawn.draw();
    };
    
    Pawn.prototype.isJumpBL = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof Window.Map.grid[posY+1][posX-1] == "object" 
            && Window.Map.grid[posY+1][posX-1].color != color 
            && typeof Window.Map.grid[posY+2] != "undefined"
            && typeof Window.Map.grid[posY+2][posX-2] != "undefined"
            && Window.Map.grid[posY+2][posX-2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpBR = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof Window.Map.grid[posY+1][posX+1] == "object" 
            && Window.Map.grid[posY+1][posX+1].color != color 
            && typeof Window.Map.grid[posY+2] != "undefined"
            && typeof Window.Map.grid[posY+2][posX+2] != "undefined"
            && Window.Map.grid[posY+2][posX+2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpTL = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof Window.Map.grid[posY-1][posX-1] == "object" 
            && Window.Map.grid[posY-1][posX-1].color != color 
            && typeof Window.Map.grid[posY-2] != "undefined"
            && typeof Window.Map.grid[posY-2][posX-2] != "undefined"
            && Window.Map.grid[posY-2][posX-2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Pawn.prototype.isJumpTR = function(selectedPawn) {
        var posX = selectedPawn.posX,
        posY = selectedPawn.posY,
        color = selectedPawn.color;
        
        if(typeof Window.Map.grid[posY-1][posX+1] == "object" 
            && Window.Map.grid[posY-1][posX+1].color != color 
            && typeof Window.Map.grid[posY-2] != "undefined"
            && typeof Window.Map.grid[posY-2][posX+2] != "undefined"
            && Window.Map.grid[posY-2][posX+2] == 0) {
            return true;
        } else {
            return false;
        }
    };
    return Pawn;
}
);
