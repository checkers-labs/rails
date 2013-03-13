/**
 * Singleton Map : 
 *  Dessine le damier contenu dans le json
 *  Tableau contenant tous les pions ainsi que les couleurs des cases : 
 *      0 ==> noir
 *      1 ==> blanc
 */
define(['config/constants', 'utils/Resource', 'class/Pawn', 'utils/Util'], function(c, Resource, Pawn, Util) {
        return {
            init: function() {
                this.mapData = JSON.parse(Util.getMapJSON("damier"));
                
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
                
                for(var i = 0, l = this.mapData.map.length ; i < l ; i++) {
                    for(var j = 0, k = this.mapData.map[i].length ; j < k ; j++) {
                        var coordinate = Util.posToCoordinate(j, i);
                        var xTileset = (this.mapData.map[i][j]-1)*c.WIDTH_TILE;
                        var tileset = new Kinetic.Image({
                             x: coordinate[0],
                             y: coordinate[1],
                             image: Resource.images.RESOURCE_TILE,
                             width: c.WIDTH_TILE,
                             height: c.HEIGHT_TILE,
                             crop: {
                                 x: xTileset,
                                 y: 0,
                                 width: c.WIDTH_TILE,
                                 height: c.HEIGHT_TILE
                             }
                        });
                        
                        tileset.on('click', function(posBefore,posAfter,posTaken) {
                            var selectedPawn = self.getSelectedPawn();
                            console.log('selectedPawn:',selectedPawn);
                            if (!selectedPawn) {
                                console.log('no selected pawn');
                            } else {
                                var coordinateClick = {x: this.getX(), y: this.getY()};
                                console.log('coordinateClick:',coordinateClick);
                                
                                var move = selectedPawn.move(selectedPawn, coordinateClick);
                                if (move == true) {
                                    // play again ?
                                    var again = self.mustWeMakeJump(window.turn);
                                    console.log('again',again);
                                    Util.sendMove([selectedPawn.posX,selectedPawn.posY], [this.getX(), this.getY()], again);
                                } else if (move == false) {
                                    Util.sendMove([selectedPawn.posX,selectedPawn.posY], [this.getX(), this.getY()], false);
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
                            var coordinate = Util.posToCoordinate(j, i);
                            //on set sa position
                            this.grid[i][j].posX = j;
                            this.grid[i][j].posY = i;
                            //on le dessine
                            this.grid[i][j].draw(coordinate[0] + c.MARGIN_WIDTH, coordinate[1] + c.MARGIN_HEIGHT);
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
            mustWeMakeJump: function(color) {
                color = typeof color !== 'undefined' ? color : false;
                for(var i = 0, l = this.grid.length ; i < l ; i++) {
                    for(var j = 0, k = this.grid[i].length ; j < k ; j++) {
                        //si il y a un pion
                        if (typeof this.grid[i][j] == "object") {
                            var selectedPawn = this.grid[i][j];
                            // si c'est un pion de couleur rouge ou si c'est une dame
                            if ((color == false && (selectedPawn.color == 0 || selectedPawn.queen))
                                    || (color == 0 && (selectedPawn.color == 0 || selectedPawn.queen))) {
                                // on regarde si on peut manger en bas à gauche
                                if(selectedPawn.isJumpBL(selectedPawn)) {
                                   return true;
                                // on regarde si on peut manger en bas à droite
                                } else if (selectedPawn.isJumpBR(selectedPawn)) {
                                    return true;
                                }
                            }
                            if ((color == false && (selectedPawn.color == 1 || selectedPawn.queen))
                                    || (color == 1 && (selectedPawn.color == 1 || selectedPawn.queen))) {
                                // on regarde si on peut manger en haut à gauche
                                if(selectedPawn.isJumpTL(selectedPawn)) {
                                   return true;
                                // on regarde si on peut manger en haut à droite
                                } else if (selectedPawn.isJumpTR(selectedPawn)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            },
            getHeight: function() {
                return this.mapData.map.length;
            }, 
            getWidth: function() {
                return this.mapData.map[0].length;
            }
        };
    }
);
