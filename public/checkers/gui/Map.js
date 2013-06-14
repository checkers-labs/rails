/**
 * Singleton Map : 
 *  Dessine le damier contenu dans le json
 *  Tableau contenant tous les pions ainsi que les couleurs des cases : 
 *      0 ==> noir
 *      1 ==> blanc
 */
define(['config/constants', 'utils/Resource', 'class/Pawn', 'utils/Util'], function(c, Resource, Pawn, Util) {
        return {
            init: function(callback) {
                this.jsonData = JSON.parse(Util.getMapJSON("wood"));
                
                this.layerMap = new Kinetic.Layer();
                this.layerPawn = new Kinetic.Layer();                
                
                this.grid = new Array(8,8);
                this.grid[0] = new Array(new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1);
                this.grid[1] = new Array(1, new Pawn(0), 1,new Pawn(0), 1, new Pawn(0), 1, new Pawn(0));
                this.grid[2] = new Array(new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1, new Pawn(0), 1);
                this.grid[3] = new Array(1, 0, 1, 0, 1, 0, 1, 0);
                this.grid[4] = new Array(0, 1, 0, 1, 0, 1, 0, 1);
                this.grid[5] = new Array(1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1));
                this.grid[6] = new Array(new Pawn(1), 1,new Pawn(1), 1, new Pawn(1), 1, new Pawn(1), 1);
                this.grid[7] = new Array(1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1), 1, new Pawn(1));
            },
            drawMap: function() {
                var self = this;
                
                for(var i = 0, l = this.jsonData.map.length ; i < l ; i++) {
                    for(var j = 0, k = this.jsonData.map[i].length ; j < k ; j++) {
                        var coordinate = Util.posToCoordinate(j, i);
                        var xTileset = this.jsonData.map[i][j] % this.jsonData.size[0];
                        if(xTileset == 0) xTileset = this.jsonData.size[0];
                        var yTileset = Math.ceil(this.jsonData.map[i][j] / this.jsonData.size[0]);
                        
                        var tileset = new Kinetic.Image({
                             x: coordinate[0],
                             y: coordinate[1],
                             image: Resource.images.RESOURCE_TILE,
                             width: c.WIDTH_TILE,
                             height: c.HEIGHT_TILE,
                             crop: {
                                 x: (xTileset - 1) * c.WIDTH_TILE,
                                 y: (yTileset - 1) * c.HEIGHT_TILE,
                                 width: c.WIDTH_TILE,
                                 height: c.HEIGHT_TILE
                             }
                        });
                        
                        tileset.on('click', function(posBefore,posAfter,posTaken) {
                            var selectedPawn = self.getSelectedPawn();
                            var posPawn = {x: selectedPawn.posX, y:selectedPawn.posY};
                            console.log('selectedPawn:',selectedPawn);
                            if (!selectedPawn && window.player == window.turn) {
                                Util.addAlert("Veuillez selectionner un pion", "error");
                            } else if(selectedPawn) {
                                var coordinateClick = {x: this.getX(), y: this.getY()};
                                console.log('coordinateClick:',coordinateClick);
                                
                                var jumpedMove = selectedPawn.move(coordinateClick);
                                if (jumpedMove == true) {
                                    // play again ?
                                    var again = selectedPawn.mustPawnMakeJump(window.player);
                                    if(again) {
                                        selectedPawn.selected = true;
                                        selectedPawn.again = true;
                                    }
                                    console.log('again',again);
                                    if (window.mod == "single") {
                                        Util.switchTurn(again);
                                    } else {
                                        Util.sendMove([posPawn.x,posPawn.y], [this.getX(), this.getY()], again);
                                    }
                                } else if (jumpedMove == false) {
                                    if (window.mod == "single") {
                                        Util.switchTurn(false);
                                    } else {
                                        Util.sendMove([posPawn.x,posPawn.y], [this.getX(), this.getY()], false);
                                    }
                                }
                            }
                        });
                        
                        this.layerMap.add(tileset);
                    }
                }
            },
            drawGrid: function() {
                for(var i = 0, l = this.grid.length ; i < l ; i++) {
                    for(var j = 0, k = this.grid[i].length ; j < k ; j++) {
                        //si il y a un pion
                        if (typeof this.grid[i][j] == "object") {
                            var coordinate = Util.posToCoordinate(j, i, 'pawn');
                            //on set sa position
                            this.grid[i][j].posX = j;
                            this.grid[i][j].posY = i;
                            //on le dessine
                            this.grid[i][j].draw(coordinate[0], coordinate[1]);
                        }
                    }
                }
            }, 
            getSelectedPawn: function() {
                for(var i = 0, l = this.grid.length ; i < l ; i++) {
                    for(var j = 0, k = this.grid[i].length ; j < k ; j++) {
                        //si il y a un pion et que son attribut selected == true
                        if (typeof this.grid[i][j] == "object" && this.grid[i][j].selected == true) {
                            return this.grid[i][j];
                        }
                    }
                }
                return false;
            }, 
            mustWeMakeJump: function(player) {
                for(var i = 0, l = this.grid.length ; i < l ; i++) {
                    for(var j = 0, k = this.grid[i].length ; j < k ; j++) {
                        //si il y a un pion
                        if (typeof this.grid[i][j] == "object") {
                            if(this.grid[i][j].mustPawnMakeJump(player)) {
                               return true;
                            }
                        }
                    }
                }
                return false;
            },
            getHeight: function() {
                return this.jsonData.map.length;
            }, 
            getWidth: function() {
                return this.jsonData.map[0].length;
            },
            isPlayerDead : function() {
                var Player0 = false;
                var Player1 = false;
                for(var i = 0, l = this.grid.length ; i < l ; i++) {
                    for(var j = 0, k = this.grid[i].length ; j < k ; j++) {                     
                        if (typeof this.grid[i][j] == "object") {
                           if(this.grid[i][j].color==0){
                               Player0=true;
                           }else{
                               Player1=true;
                           }
                        }
                        if(Player0 && Player1){
                            return 2;//still in game
                        }
                    }
                }
                if(!Player0){
                    return 0;//first dead
                }else{
                    return 1;//second dead
                }                
            },
        };
    }
);
