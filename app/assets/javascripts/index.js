function waitForInvite() {
    $.ajax({
        type: "GET",
        url: "/wait",
        dataType: "json",
        success: function ( data, textStatus, jqXHR ) {
            if (data != false) {
                if (confirm("Vous avez une invitation de la part de "+data[1]+"\n\nVoulez vous l'accepter ?")==true) {
                    console.log('ok');
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
            setTimeout(function () { waitForInvite(); }, 3000);
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