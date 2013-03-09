define(['config/constants'], function(c) {
        return {
            images: {}, 
            
            init: function(callback) { 
                var totalResource = 0,
                loadedImages = 0;
                
                for(var index in c.RESOURCES){
                    totalResource++;
                }
                
                for (var index in c.RESOURCES){
                    this.images[index] = new Image();
                    
                    this.images[index].onload = function(){
                        if(++loadedImages >= totalResource){
                            callback();
                        }
                    };
                    
                    this.images[index].src = c.RESOURCES[index];   
                }
            }
        };
    }
);