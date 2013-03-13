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
                            if(!JSON.parse(data[0])) {
                                window.turn = window.turn == 1 ? 0 : 1;
                            }
                            var pawn = window.Map.grid[data[1][1]][data[1][0]];
                            pawn.move(data[2][0], data[2][1]);
                        }else{                                
                           setTimeout(function () { self.getMove(); }, 3000); 
                        }
                    }     
                });
            }
        };
    }
);
