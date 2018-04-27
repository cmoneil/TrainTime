
// ========================================== START CODING BELOW!!

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDuXuJbEc-xNzklxeEudl02uXGeBtryyWY",
    authDomain: "train-time-170bf.firebaseapp.com",
    databaseURL: "https://train-time-170bf.firebaseio.com",
    projectId: "train-time-170bf",
    storageBucket: "train-time-170bf.firebaseapp.com",
    messagingSenderId: "724712173370"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var trainName;
var destination;
var firstTrain;
var frequency;
var randomFormat = "HH:mm";
var convertedTime = moment(firstTrain, randomFormat);


// Capture Button Click
$("#trainForm").submit(function (event) {
    event.preventDefault();


    // Grabbed values from text boxes
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);

    // Code for handling the push
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#trainName,#destination,#firstTrain,#frequency").val("");

});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().on("child_added", function (childSnapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = childSnapshot.val();

    // Console.loging the last user's data
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.firstTrain);
    console.log(sv.frequency);



    var randomFormat = "HH:mm";
    var convertedTime = moment(sv.firstTrain, randomFormat);
    var currentTime = moment();
    console.log("current" + moment(currentTime).format("HH:mm"));
    console.log(convertedTime);

    var diffTime = moment().diff(moment(convertedTime), "minutes");
    console.log(diffTime);
    var tRemainder = diffTime % sv.frequency;
    console.log(tRemainder);

    // Minutes Until Train
    var tMinutesTillTrain = sv.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextArrival = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));



    $('#tableStuff').append(`<tr><td>${sv.trainName}</td>
    <td>${sv.destination}</td>
    <td class="numbers">${sv.frequency}</td>
    <td class="numbers">${moment(nextArrival).format("hh:mm a")}</td>
    <td class="numbers">${tMinutesTillTrain}</td><td></tr>`)


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});