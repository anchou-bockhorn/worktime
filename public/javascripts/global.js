// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#timer table tbody td').on('click', 'button', fireThat);
    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================


// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AtJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
}

// Fire That

function fireThat(event){
     // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $("#userName").text();

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);


    // Get our User Object
    var thisUserObject = userListData[arrayPosition];
    user_pin = thisUserObject.pin;
    input_pin = $("input#inputPin").val();
    if (input_pin != user_pin){
        alert("Wrong PIN, Sir");
    }
    else {
        var button_identifier = $(this).attr('id');
        if (button_identifier == 'start' || button_identifier == 'stop'){
            fireTimer(button_identifier, thisUserObject);
        }
        else if (button_identifier == 'zmittag'){
            modifySession(thisUserObject._id, 3);
        }
        else if (button_identifier == 'zigi'){
            modifySession(thisUserObject._id, 2);
        }
    }
}




// Fire Timer

function fireTimer(text, userObj){
    if (text == 'start'){
        if (userObj.status == 1){
            alert("Already running!")
        }
        else {
            changeTimerState(userObj._id, 1);
            createNewSession(userObj);
}
    }
    
    else if (text == 'stop'){
        if (userObj.status == 0){ 
            alert("Already stopped!")
        }
        else {
            console.log("User "+ userObj._id + " stopping...");
            changeTimerState(userObj._id, 0);
            endRunningSession(userObj._id);
	    $("#inputPin").val("");


        }

    }
}



// create new session

function createNewSession(userObj){
    console.log("User "+ userObj.name +" starting...");
    $.ajax({
        type: 'POST',
        data: '',
        url: '/sessions/new/'+userObj._id,
        dataType: 'JSON'
    }).done(function( response ) {
        console.log(response.msg)
	$("input#inputPin").val("");
	location.reload();
	
    })

}

// end running session
function endRunningSession(userId){
    modifySession(userId, 0);
    //console.log('session_id: '+session_id + ' ended.');


}
// end = 0,  start = 1, zigi = 2, zmittag = 3
function modifySession(userId, reason){
    var sessionId;
    $.ajax({
        type: 'GET',
        data: '',
        url: '/sessions/active/'+userId,
        dataType: 'JSON'
    }).done(function( response ) {
        sessionId = response[0]._id;
        console.log(sessionId+ ' modified.');
        if (reason == 0) {
            $.ajax({
                type: 'PUT',
                data: '',
                url: '/sessions/end/' + sessionId,
                dataType: 'JSON'
            }).done(function (res) {
                console.log(res);
		location.reload();

            })
        }
        else if (reason == 1){
            alert('Tried to start active session. 3RR0R');
        }
        else if (reason == 2){
            pause(sessionId, 'zigi');
        }
        else if (reason == 3){
            pause(sessionId, 'zmittag');
        }
    })
}
// type is either 'zigi' or 'zmittag'
function pause(sessionId, type){
    $.ajax({
        type: 'PUT',
        data: '',
        url: '/sessions/' + type + '/' + sessionId,
        dataType: 'JSON'
    }).done(function (res) {
        console.log(res);
        location.reload();
    });
}

// Start / stop Timer (set status to 0 / 1)

function changeTimerState(id, new_status){
    var that = {"status":new_status, "reason":"status"};
    $.ajax({
            type: 'PUT',
            data: that,
            url: '/users/updateuser/'+id,
            dataType: 'JSON'
        }).done(function( response ) {
        console.log(response.msg);
	location.reload();
        });
}

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userName').text(thisUserObject.username);
    $('#userInfoName').text(thisUserObject.name);
    $('#userInfoTime').text(thisUserObject.time);

}
