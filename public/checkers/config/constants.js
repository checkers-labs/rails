/**
 * fichier ou l'on defini nos constantes
 */
define([], function() {
        var constant = {
            //Game prefs
            WIDTH_TILE      : 60,
            HEIGHT_TILE     : 60,
            WIDTH_PAWN      : 40,
            HEIGHT_PAWN     : 40,
            MARGIN_WIDTH    : (this.WIDTH_TILE - this.WIDTH_PAWN)/2,
            MARGIN_HEIGHT   : (this.HEIGHT_TILE - this.HEIGHT_PAWN)/2,

            //Ressources
            RESOURCES: { 
                RESOURCE_TILE   : '/checkers/resources/tile.png',
                RESOURCE_PAWN   : '/checkers/resources/pawn.png'
            }
        };
        return constant;
    }
);