var socket = io()


var thisUser;



socket.on("whatever", function(data) {
    console.log('You got data from the server:')
    console.log(data);
});

$(document).ready(function() {
    thisUser = window.location.href.split('?code=')[1];


// sending stuff back to the server:
    $("#clickButton").on("click", function() {
        console.log('button clicked');
        $.ajax({
            method: "POST",
            url: "/test",
            data: {
                data1: "test1",
                data2: ["hi,", "test"]
            }
        });
    })

});

// either use ajax:



//
