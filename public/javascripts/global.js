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
        fireTimer($(this).text(), thisUserObject);
        var stamp = Date.now() / 1000 | 0;
        alterTimestamps(thisUserObject._id, stamp, stamp);
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
            modifySession(getMostRecentSession(userObj), '');
        }

    }
}



// create new session @param id

function createNewSession(userObj){
    timestamp = returnTimestamp();
    console.log("User "+ userObj.name +" starting...");
    date = new Date();
    var reasons = {"date":date, "timestamp":timestamp, "reason":"session"};

    $.ajax({
        type: 'PUT',
        data: reasons,
        url: '/users/updateuser/'+id,
        dataType: 'JSON'
    }).done(function( response ) {
        console.log(response.msg)
    })
}
// set Timestamps in nested list

function alterTimestamps(id, timestamp_id, timestamp){
    var that = {"timestamp_id":timestamp_id, "timestamp":timestamp, "reason":"timestamp"};
    $.ajax({
            type: 'PUT',
            data: that,
            url: '/users/updateuser/'+id,
            dataType: 'JSON'
        }).done(function( response ) {
        console.log(response.msg)
        })
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
        console.log(response.msg)
        });
location.reload();
}



// Show User Info



function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);



    // Get our User Object
    var thisUserObject = userListData[arrayPosition];
    //console.log(thisUserObject.currenttime);

    //Populate Info Box
    $('#userName').text(thisUserObject.username);
    $('#userInfoName').text(thisUserObject.name);
    $('#userInfoTime').text(thisUserObject.time);
    //$('#userInfoGender').text(thisUserObject.gender);
    //$('#userInfoLocation').text(thisUserObject.location);

    function returnTimestamp(){
    stamp = Date.now() / 1000 | 0;
    return stamp;
}

function addUser(user, full, pincode) {
    stamp = returnTimestamp();
    var newUser = {
        username: user,
        name: full,
        pin: pincode,
        status: 0,
        timestamp: {stamp: 0}
    };
    $.ajax({
        type: 'POST',
        data: newUser,
        url: '/users/adduser',
        dataType: 'JSON'
    }).done(function (response) {
        console.log(response.msg)
    })
}}