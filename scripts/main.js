  var IntentMedia = IntentMedia || {};

  IntentMedia.Airports = (function () {
     var pub = {};

     pub.airport_exists = function (airport_code) {
        return pub.airport_distances().hasOwnProperty(airport_code);
     };

     pub.airport_distances = function () {
        return {
           JFK: {
              LAX: 2475,
              LAS: 2248,
              PDX: 2454
           },
           LAX: {
              JFK: 2475,
              LAS: 236,
              PDX: 834
           },
           LAS: {
              JFK: 2248,
              LAX: 236,
              PDX: 763
           },
           PDX: {
              JFK: 2454,
              LAS: 763,
              LAX: 834
           }
        }
     };

     return pub;
  }(IntentMedia || {}));

  IntentMedia.Distances = (function () {
     var pub = {};
     var airport_distances = airport_distances || IntentMedia.Airports.airport_distances();

     pub.distance_between_airports = function (from_airport, to_airport) {
        if (IntentMedia.Airports.airport_exists(from_airport) && IntentMedia.Airports.airport_exists(
              to_airport)) {
           if (from_airport === to_airport) {
              return 0;
           }

           return airport_distances[from_airport][to_airport];
        }

        return -1;
     };

     return pub;
  }(IntentMedia || {}));

  const fakeFetchedData = ['JFK', 'LAX', 'LAS', 'PDX', 'NAN', 'NON'];
  let distanceTotal = document.getElementById("distance");
  let feedbackMessage = document.getElementById("feedBack");
  let pageInputElements = document.querySelectorAll('.selectInput');
  let intentChecked = fakeFetchedData.filter(function (airport) {
     return IntentMedia.Airports.airport_exists(airport);
  });

  function autocomplete(inp, arr) {
     var currentFocus;
     inp.addEventListener("input", function (e) {

        var divElement, val = this.value;
        closeAllLists();

        if (!val) {
           return false;
        }
        currentFocus = -1;
        divElement = document.createElement("DIV");
        divElement.setAttribute("id", this.id + "autocomplete-list");
        divElement.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(divElement);

        let filteredItems = arr.map((arrayItem) => completeChecker(arrayItem, val)).filter(Boolean)

        filteredItems.forEach((item) => divElement.appendChild(item))
     });


     inp.addEventListener("keydown", function (e) {
        var activeAutocompleteList = document.getElementById(this.id +
           "autocomplete-list");
        if (activeAutocompleteList) activeAutocompleteList = activeAutocompleteList.getElementsByTagName("div");
        if (e.keyCode == 40) {
           currentFocus++;
           addActive(activeAutocompleteList);
        } else if (e.keyCode == 38) {
           e.preventDefault();
           if (currentFocus > -1) {
              if (activeAutocompleteList) activeAutocompleteList[currentFocus].click();
           }
        }
     });

     function completeChecker(arrayItem, val) {

        if (arrayItem.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
           let autocompleteItem = document.createElement("DIV");
           autocompleteItem.innerHTML = "<strong>" + arrayItem.substr(0, val.length) + "</strong>";
           autocompleteItem.innerHTML += arrayItem.substr(val.length);
           autocompleteItem.innerHTML += "<input type='hidden' value='" + arrayItem + "'>";
           autocompleteItem.addEventListener("click",
              function (e) {
                 inp.value = this.getElementsByTagName("input")[0].value;
                 closeAllLists();
                 validateForm();
              });

           return autocompleteItem;
        }
     }


     function addActive(activeList) {

        if (!activeList) return false;
        removeActive(activeList);
        if (currentFocus >= activeList.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (activeList.length - 1); /*add class "autocomplete-active" :*/
        activeList[currentFocus].classList.add("autocomplete-active");

     }

     function removeActive(activeList) {
        for (var i = 0; i <
           activeList.length; i++) {
           activeList[i].classList.remove("autocomplete-active");
        }
     }

     function closeAllLists(elmnt) {

        var activeList = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < activeList.length; i++) {
           if (elmnt != activeList[i] && elmnt != inp) {
              activeList[i].parentNode.removeChild(activeList[i]);
           }
        }
     }
     document.addEventListener("click", function (e) {

        closeAllLists(e.target);
     });
  }

  function validateForm() {
     var from = document.forms["distanceForm"]["from_airport"].value;
     var to = document.forms["distanceForm"]["to_airport"].value;
     (!IntentMedia.Airports.airport_exists(from)) ?
     feedBack('Please select a departing airport from the list.'):
        (!IntentMedia.Airports.airport_exists(to)) ?
        feedBack('Please select a destination airport from the list.') :
        travelListener(from, to);
     return;
  }

  function travelListener(from, to) {
     distanceTotal.innerText = " Distance:" + " " + IntentMedia.Distances.distance_between_airports(from,
        to);
     return feedBack('');
  }

  function feedBack(message) {
     feedbackMessage.innerText = message;
     return;
  }

  function invokeAutocomplete(targetElements) {
     if (targetElements) {
        targetElements.forEach(function (input) {
           autocomplete(input, intentChecked);
        });
        return targetElements;
     }
  }

  function completeChecker(arrayItem, val) {

     if (arrayItem.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        let autocompleteItem = document.createElement("DIV");
        autocompleteItem.innerHTML = "<strong>" + arrayItem.substr(0, val.length) + "</strong>";
        autocompleteItem.innerHTML += arrayItem.substr(val.length);
        autocompleteItem.innerHTML += "<input type='hidden' value='" + arrayItem + "'>";
        autocompleteItem.addEventListener("click",
           function (e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
              validateForm();
           });
        return autocompleteItem;
     }
  }

  function devToggle(callback) {
     let keySequence = [];
     const devMode = '38,38,40,40,37,39,37,39,66,65';
     const resetArray = '16';
     return event => {
        const theKey = event.keyCode;
        keySequence.push(theKey);
        if (keySequence.toString().indexOf(devMode) >= 0) {
           callback();
           keySequence = [];
        } else if (keySequence.toString().lastIndexOf(resetArray) >= 0) {
           console.log('Succesfully Reset Developer Mode Sequence');
           keySequence = [];
        }
     };
  }


  const handler = devToggle(() => {
     const hiddenButtonDiv = document.getElementById('devHolder');
     hiddenButtonDiv.setAttribute("class", "show");
  });
  window.addEventListener('keydown', handler);

  if (document.readyState === "loading") {
     document.addEventListener("DOMContentLoaded", invokeAutocomplete(pageInputElements));
  } else {
     invokeAutocomplete(pageInputElements);
  }