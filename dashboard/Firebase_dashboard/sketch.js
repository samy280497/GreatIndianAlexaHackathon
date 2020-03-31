// A2Z F16
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F16

// Get input from user
var fruitInput;
//var totalInput;

// Keep list of DOM elements for clearing later when reloading
var listItems = [];
var database;

function setup() {

  var config = {
    apiKey: "AIzaSyBHuAYDCCOw72Mk4gvW_rCeMsNRUeGTBew",
    authDomain: "myapp-f80a0.firebaseapp.com",
    databaseURL: "https://myapp-f80a0.firebaseio.com",
    storageBucket: "myapp-f80a0.appspot.com",
    messagingSenderId: "748285857633"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  // Input fields
  LocationInput = select('#Location');
  //totalInput = select('#total');

  // Submit button
  var submit = select('#submit');
  submit.mousePressed(sendToFirebase);

  // Start loading the data
  loadFirebase();
}

function loadFirebase() {
  var ref = database.ref("Location");
  ref.on("value", gotData, errData);
}

function errData(error) {
  console.log("Something went wrong.");
  console.log(error);
}

// The data comes back as an object
function gotData(data) {
  var Locationz = data.val();
  // Grab all the keys to iterate over the object
  var keys = Object.keys(Locationz);

  // clear previous HTML list
  clearList();

  // Make an HTML list
  var list = createElement('ol');
  list.parent('data');

  // Loop through array
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var Location = Locationz[key];
    var li = createElement('li', Location + Location.Location + ': ' + ", key: " + key);
    li.parent(list);
    listItems.push(li);
  }
}

// Clear everything
function clearList() {
  for (var i = 0; i < listItems.length; i++) {
    listItems[i].remove();
  }
}

// This is a function for sending data
function sendToFirebase() {
  var Locations = database.ref('Location');

  // Make an object with data in it
  var data = {
    Location: LocationInput.value(),
   // total: totalInput.value()
  }

  var Location = Locations.push(data, finished);
  console.log("Firebase generated key: " + Location.key);

  // Reload the data for the page
  function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      console.log('Data saved successfully');
    }
  }
}
