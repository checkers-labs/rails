define(['libraries/oXHR', 'config/constants'], function(oXHR, c) {
        
        return {            
            getMapJSON: function(name) {
                var xhr = oXHR.getXMLHttpRequest();
                xhr.open("GET", '/checkers/config/maps/' + name + '.json', false);
                xhr.send(null);
                if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) {
                    throw new Error("Impossible de charger la carte nommée \"" + name + "\" (code HTTP : " + xhr.status + ").");
                }
                return xhr.responseText;
            },
            coordinateToPos: function(x, y) {
                var coordinate = new Array(x/c.WIDTH_TILE, y/c.HEIGHT_TILE);
                return coordinate;
            },
            posToCoordinate: function(x, y) {
                var coordinate = new Array(x*c.WIDTH_TILE, y*c.HEIGHT_TILE);
                return coordinate;
            },
            getMove:function(){
                var self=this;
                $.ajax({
                    type: "GET",
                    url: "/getMove",
                    dataType: "json",
                    async: false,
                    success:function(data){
                        if(data){
                            // si à nous de jouer
                            if(!data[0]) {
                                Window.turn = Window.turn == 1 ? 0 : 1;
                            }
                            var pawn = Window.Map.grid[data[2][1]][data[2][0]]);
                            pawn.move(data[3][0], data[3][1]);
                        }else{                                
                           setTimeout(function () { self.getMove(); }, 3000); 
                        }
                    }     
                });
            }
        };
    }
);