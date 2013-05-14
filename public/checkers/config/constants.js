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
            MARGIN_WIDTH    : (60 - 40)/2,
            MARGIN_HEIGHT   : (60 - 40)/2,
            PADDING         : 32,

            //Ressources
            RESOURCES: { 
                RESOURCE_TILE        : '/checkers/resources/tile.png',
                RESOURCE_PAWN        : '/checkers/resources/pawn.png',
                RESOURCE_PAWN_OVER   : '/checkers/resources/pawn_over.png'
            }
        };
        return constant;
    }
);