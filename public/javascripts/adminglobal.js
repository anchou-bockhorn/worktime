// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkuserdetails', showUserDetails);
    $('#timer table tbody td').on('click', 'button', fireThat);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    $(document).on('click','button',renderDetails);
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
            tableContent += '<td><a href="#" class="linkuserdetails" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '<td>' + '' + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.username + '">' + '[x]' + '</a></td>';
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
        alert("WRONG PIN MOTHERFUCKER!");
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
            console.log("User "+ userObj._id +" starting...");
            stamp = +new Date();
            console.log(stamp/1000);
            changeTimerState(userObj._id, 1);
}
    }
    
    else if (text == 'stop'){
        if (userObj.status == 0){ 
            alert("Already stopped!")
        }
        else {
            console.log("User "+ userObj._id + " stopping...");
            changeTimerState(userObj._id, 0);
        }

    }
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


// Start Timer (set status from 0 to 1)

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


// Delete user

function deleteUser(event){
    event.preventDefault();
    var thisUserName = $(this).attr('rel');
    $.ajax({
        type: 'DELETE',
        data: "",
        url: '/admin/deleteuser/'+thisUserName,
        dataType: 'JSON'
    }).done(function( response ) {
        console.log(response.msg)
    });
    location.reload();

}

// Show User Details

function showUserDetails(event) {

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

}

function returnTimestamp(){
    stamp = Date.now() / 1000 | 0;
    return stamp;
}

function addUser(user, full, pincode) {
    stamp = returnTimestamp();
    var newUser = {
    username:user,
    name:full,
    pin:pincode,
    status:0,
    timestamp: {stamp:0}
    };
    $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response){
        console.log(response.msg)
        })
}

function renderDetails(){
    var queryObj = {};
    queryObj.syear = $("#start_year").find(':selected').text();
    queryObj.smonth = $("#start_month").find(':selected').text();
    queryObj.sday = $("#start_day").find(':selected').text();

    queryObj.eyear = $("#end_year").find(':selected').text();
    queryObj.emonth = $("#end_month").find(':selected').text();
    queryObj.eday = $("#end_day").find(':selected').text();


    console.log(queryObj);
    $.ajax({
        type: 'POST',
        data: queryObj,
        url: '/sessions/filter',
        dataType: 'JSON'
    }).done(function(response){
        fillSessionTable(response);
    })
}

function fillSessionTable(sessions) {

    // Empty content string
    var tableContent = '';

    // jQuery AtJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            var username = this.username;
            var user_id = this._id;
            var total_hours = 0;
            var midnight_hours = 0;
            $.each(sessions, function (i, v) {
                if(v.userId == user_id){
                    var date_diff = v.date_ended.timestamp_ended - v.date_started.timestamp_started;
                    var seconds = date_diff/1000;
                    var hours = seconds/3600;
                    total_hours += hours;
                    console.log('Found matching session for user: ' + username + ' with session id: ' + v._id);
                    console.log('session '+ i + ': '+ hours + ' hours');
                    console.log('------------');
                }
                total_hours = parseFloat(total_hours).toFixed(2);
            })


            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkuserdetails" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '<td>' + total_hours + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.username + '">' + '[x]' + '</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
}
