requirejs.config({
    //By default load any module IDs from /checkers
    baseUrl: '/checkers/',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    //paths: {
    //    app: '../app'
    //}
});

// Start the main app logic.
requirejs(['libraries/kineticjs-v433/kinetic', 'config/constants', 'utils/Resource', 'gui/Map', 'utils/Util'],
function (kinetic, c, Resource, Map, Util) {
    // config de l'ajax pour mettre le bon header
    $.ajaxSetup({
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')}
    });
    // on set le tour pour le joueur '0' et on passe la Map en global
    window.turn = 0;
    window.Map = Map;
    
    if(document.cookie.split('=')[1] == 1) {
        Util.getMove();
    }
    Resource.init(function() {
        Map.init();
        var scene = new Kinetic.Stage({
            container: "kinetic",
            width: Map.getWidth() * c.WIDTH_TILE,
            height: Map.getHeight() * c.HEIGHT_TILE
        });
        
        Map.drawMap();
        Map.drawGrid();
        
        scene.add(Map.layerMap);
        scene.add(Map.layerPawn);
    });
});