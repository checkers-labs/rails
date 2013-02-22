var boot = function() {
	var scene = new Kinetic.Stage({
		container: "kinetic",
		width: Map.getWidth() * WIDTH_TILE,
		height: Map.getHeight() * HEIGHT_TILE
	});
	
	Map.init();
	Map.drawMap();
	Map.drawGrid();
	
	scene.add(Map.layerMap);
	scene.add(Map.layerPawn);
};

Resource.init(boot);