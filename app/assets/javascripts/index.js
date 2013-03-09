function waitForInvite() {
    $.ajax({
        type: "GET",
        url: "/isInvited",
        dataType: "json",
        success: function ( data, textStatus, jqXHR ) {
            if (data != false) {
                if (confirm("Vous avez une invitation de la part de "+data[1]+"\n\nVoulez vous l'accepter ?")==true) {
                	$.ajax({
					   type: "GET",
				        url: "/acceptInvite",
				        dataType: "json",
				        async: false,
                        data: { id: data[0] },
                        success: function ( data, textStatus, jqXHR ) {
                        	window.location='/game'
                        }
				      });                	
                } else {
                    $.ajax({
                        type: "GET",
                        url: "/cancelInvite",
                        async: false,
                        data: { id: data[0] },
                        success: function ( data, textStatus, jqXHR ) {
                        }
                    });
                }
            }
        },
        complete: function ( jqXHR, textStatus ) {
            setTimeout(function () { waitForInvite(); }, 9000);
        }
      });
}

$(document).ready(function() {
    waitForInvite();    
});

$(".ajax").click(function(event) {
    event.preventDefault();
    var self = $(this);
    $.ajax({
        type: "GET",
        url:  self.attr('href'),
        success: function ( data, textStatus, jqXHR ) {
            //console.log('Invitation send!');
        }
    });
});