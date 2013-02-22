var Resource = {
	images: {},
		
    init: function(callback) {		
		var totalResource = 0;
		var loadedImages = 0;
		
		for(var index in RESOURCE){
			totalResource++;
		}
		
		for (var index in RESOURCE){
			Resource.images[index] = new Image();
			
			Resource.images[index].onload = function(){
				if(++loadedImages >= totalResource){
					callback();
				}
			};
			
			Resource.images[index].src = RESOURCE[index];	
		}
    }
};