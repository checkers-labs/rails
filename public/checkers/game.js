requirejs.config({
    //By default load any module IDs from /checkers
    baseUrl: '/checkers/'
});

// Start the main app logic.
requirejs(['libraries/kineticjs-v433/kinetic', 'libraries/underscore', 'libraries/sonic', 'config/constants', 'utils/Resource', 'gui/Map', 'utils/Util'],
function (kinetic, underscore, sonic, c, Resource, Map, Util) {
    var square = new Sonic({
        width: 100,
        height: 50,
        padding: 10,
        stepsPerFrame: 2,
        trailLength: 1,
        pointDistance: .03,
        strokeColor: '#FF7B24',
        step: 'fader',
        multiplier: 2,
        setup: function() {
            this._.lineWidth = 5;
        },
        path: [
        
            ['arc', 10, 10, 10, -270, -90],
            ['bezier', 10, 0, 40, 20, 20, 0, 30, 20],
            ['arc', 40, 10, 10, 90, -90],
            ['bezier', 40, 0, 10, 20, 30, 0, 20, 20]
        ]
    });
    square.play();
    $('#loading').append(square.canvas);
    Resource.init(function() {
        square.stop();
        $('#loading').hide();
        // on set le tour pour le joueur et on passe la Map en global
        window.player = document.cookie.split('=')[1];
        window.turn = 0;
        window.maxTurn = 25;
        window.Map = Map;
        // gestion du mode solo
        window.mod = Util.urlParam("mod");
        if(window.mod == "single") {
            window.player = 0;
        }
        if(window.player == 1) {
            Util.addAlert("C'est à votre adversaire de jouer !", "info");
            Util.getMove();
        } else {
            Util.addAlert('A votre tour de jouer ;)', 'info');
        }
        
        Map.init();
        var scene = new Kinetic.Stage({
            container: "kinetic",
            width: Map.getWidth() * c.WIDTH_TILE,
            height: Map.getHeight() * c.HEIGHT_TILE
        });
        $('#kinetic').attr('style', $('#kinetic :first-child').attr('style'));
        $('#alert').width($('.hero-unit').width() - (parseInt($('.hero-unit').css('padding'), 10)) - $('#kinetic').width());
        
        Map.drawMap();
        Map.drawGrid();
        
        scene.add(Map.layerMap);
        scene.add(Map.layerPawn);
    });
});