function waitForInvite() {
    $.ajax({
        type: "GET",
        url: "/wait",
        dataType: "json",
        success: function ( data, textStatus, jqXHR ) {
            if(data[0] == 'invite') {
                if (confirm("Vous avez une invitation de la part de "+data[2]+"\n\nVoulez vous l'accepter ?")==true) {
                    $.ajax({
                        type: "POST",
                        url: "/acceptInvite",
                        dataType: "json",
                        data: { id: data[1] },
                        success: function ( data, textStatus, jqXHR ) {
                            window.location='/game';
                        }
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/cancelInvite",
                        dataType: "json",
                        data: { id: data[1] },
                        success: function ( data, textStatus, jqXHR ) {
                        }
                    });
                }
            } else if(data[0] == 'game') {
                window.location='/game';
            }
        },
        complete: function ( jqXHR, textStatus ) {
            setTimeout(function () { waitForInvite(); }, 3000);
        }
      });
}

$(document).ready(function() {
    waitForInvite();      
    $('.alert-error').hide();  
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
