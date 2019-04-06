// Initialize Firebase
var config = {
    apiKey: "AIzaSyCE1ZicCGxVlkacQuiRnQfrLOj86oFdE3s",
    authDomain: "trainschedule-c0267.firebaseapp.com",
    databaseURL: "https://trainschedule-c0267.firebaseio.com",
    projectId: "trainschedule-c0267",
    storageBucket: "trainschedule-c0267.appspot.com",
    messagingSenderId: "580403382211"
};
firebase.initializeApp(config);

var database = firebase.database();

var index = 1
var name = "";
var destination = "";
var time = moment();
var frequency = 0;

database.ref().on("child_added", function (snapshot) {
    var data = snapshot.val();
    console.log("Entry from DB: " + JSON.stringify(data));

    createSchedule(data);
})

function createSchedule(data) {
    var train = data
    
    name = train.name;
    destination = train.destination;
    time = moment(train.startDate).local();
    frequency = train.frequency;

    var row = $("<tr>")
    var indextag = $("<th>").text("#" + index)
    var nametag = $("<th>").text(name)
    var destinationtag = $("<th>").text(destination)
    var frequencytag = $("<th>").text(frequency)

    var minutesDifference = moment().diff(moment(time), 'minutes');
    var times = Math.ceil(minutesDifference / frequency);
    var minutes = times * frequency;
    
    var timeCalc = moment(time).add(minutes, 'minutes');
    var timeCalcString = timeCalc.format("HH:mm");
    
    var minutesAway = moment(timeCalc).diff(moment(), 'minutes');
    
    var nextArrivalTag = $("<th>").text(minutesAway)
    index++

    row.append(indextag)
    row.append(nametag)
    row.append(destinationtag)
    row.append(frequencytag)
    row.append(timeCalcString)
    row.append(nextArrivalTag)

    $("#train").append(row)
}

$(".submitForm").on("click", function (event) {
    console.log("In submit form");
    event.preventDefault();
    name = $("#name").val().trim();
    destination = $("#destination").val().trim();
    startDate = moment($("#time").val().trim(), "HH:mm").utc().valueOf();
    frequency = parseInt($("#frequency").val().trim());

    console.log("About to enter in database the following...");
    console.log("Name: " + name);
    console.log("Destination: " + destination);
    console.log("Start Date: " + startDate);
    console.log("Frequency: " + frequency);

    database.ref().push({
        name: name,
        destination: destination,
        startDate: startDate,
        startDate: startDate,
        frequency: frequency,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    })

})