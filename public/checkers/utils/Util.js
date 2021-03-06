define([ 'libraries/oXHR', 'config/constants' ], function(oXHR, c) {
    return {
        urlParam : function(name) {
            var result = new RegExp(name + "=([^&]*)", "i")
                    .exec(window.location.search);
            return result && result[1] || false;
        },
        getMapJSON : function(name) {
            var xhr = oXHR.getXMLHttpRequest();
            xhr.open("GET", '/checkers/config/maps/' + name + '.json', false);
            xhr.send(null);
            if (xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) {
                throw new Error("Impossible de charger la carte nommée \""
                        + name + "\" (code HTTP : " + xhr.status + ").");
            }
            return xhr.responseText;
        },
        coordinateToPos : function(x, y, type) {
            if (type == 'pawn') {
                var coordinate = new Array((x-c.PADDING) / c.WIDTH_TILE, (y-c.PADDING) / c.HEIGHT_TILE);
            } else {
                var coordinate = new Array(x / c.WIDTH_TILE, y / c.HEIGHT_TILE);
            }
            return coordinate;
        },
        posToCoordinate : function(x, y, type) {
            if (type == 'pawn') {
                var coordinate = new Array(x * c.WIDTH_TILE + c.MARGIN_WIDTH + c.PADDING, y * c.HEIGHT_TILE + c.MARGIN_HEIGHT + c.PADDING);
            } else {
                var coordinate = new Array(x * c.WIDTH_TILE, y * c.HEIGHT_TILE);
            }
            return coordinate;
        },
        addAlert : function(text, type) {
            switch (type) {
            case 'info':
                $('#game_alert-info').html(text);
                break;
            case 'error':
                $('.alert-error').show();
                $('#game_alert-error').html(text);
                break;
            }
        },
        supprAlert : function() {
            $('.alert-error').hide();
        },
        switchTurn : function(again) {
            window.maxTurn--;
            if (window.maxTurn == 0) {
                alert('finish');
            }
            if (!again) {
                console.log("switchTurn");
                window.turn = window.turn == 1 ? 0 : 1;
                window.player = window.player == 1 ? 0 : 1;
                this.addAlert("C'est à votre adversaire de jouer !", "info");
            }
        },
        sendMove : function(posBefore, posAfter, again) {
            var self = this;
            $.ajax({
                type : "POST",
                url : "/setMove",
                dataType : "json",
                data : {
                    pawnBefore : posBefore,
                    pawnAfter : posAfter,
                    again : again
                },
                success : function(data, textStatus, jqXHR) {
                    // si c'est à l'autre de jouer
                    if (!again) {
                        window.maxTurn--;
                        if (window.Map.isPlayerDead() != 2) {
                            alert('finish');
                        }
                        if (window.maxTurn == 0) {
                            alert('finish');
                        }
                        window.turn = window.turn == 1 ? 0 : 1;
                        self.addAlert("C'est à votre adversaire de jouer !",
                                "info");
                        self.getMove();
                    }
                }
            });
        },
        getMove : function() {
            var self = this;
            $.ajax({
                type : "GET",
                url : "/getMove",
                dataType : "json",
                success : function(data, textStatus, jqXHR) {
                    if (data) {
                        for ( var i = 1; i < data.length; i += 2) {
                            var pawn = window.Map.grid[data[i][1]][data[i][0]];
                            var posPawn = {
                                x : data[i + 1][0],
                                y : data[i + 1][1]
                            };
                            pawn.move(posPawn);
                        }
                        // si à nous de jouer
                        if (!JSON.parse(data[0])) {
                            window.maxTurn--;
                            if (window.Map.isPlayerDead() != 2) {
                                alert('finish');
                            }
                            if (window.maxTurn == 0) {
                                alert('finish');
                            }
                            window.turn = window.turn == 1 ? 0 : 1;
                            self.addAlert('A votre tour de jouer ;)', 'info');
                        } else {
                            self.getMove();
                        }
                    } else {
                        setTimeout(function() {
                            self.getMove();
                        }, 2000);
                    }
                }
            });
        }
    };
});
