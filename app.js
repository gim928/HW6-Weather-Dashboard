var searchButton = document.querySelector(".btn");
var card = document.querySelector(".card-body");
var list = document.querySelector(".list");
var createHeading = document.querySelector(".card-title");
var todaysDate = moment().format("dddd, MM-DD-YYYY");
var cardDate = moment().format("dddd, MMMM Do");
var cardDiv = document.querySelector(".day-cards");
var cityName;
var citySaved;
var savedDisplay = document.querySelector(".savedList");

loadData();
//load saved cities
function loadData() {
  var savedArray = [];
  var savedCities = JSON.parse(localStorage.getItem("savedArray"));
  if (savedCities) {
    savedArray = savedCities;
  }
  console.log(savedArray);
  makeButton(savedArray);
}

//save user input
function saveData() {
  var savedArray = [];
  var savedCities = JSON.parse(localStorage.getItem("savedArray"));
  if (savedCities) {
    savedArray = savedCities;
  }
  var citySaved = document.querySelector(".city").value;
  if (savedArray.includes(citySaved)) {
    return;
  }
  savedArray.push({ citySaved });
  localStorage.setItem("savedArray", JSON.stringify(savedArray));
  makeButtonUserInput(citySaved);
}

function makeButtonUserInput(citySaved) {
  var divButton = document.createElement("div");
  divButton.setAttribute("class", "d-grid gap-2");
  var cityButton = document.createElement("button");
  cityButton.setAttribute("class", "btn btn-outline-primary btnCity");
  cityButton.setAttribute("type", "button");
  cityButton.textContent = citySaved;
  savedDisplay.appendChild(divButton);
  divButton.appendChild(cityButton);
}

//dynamically load buttons with saved city names
function makeButton(savedArray) {
  for (var i = 0; i < savedArray.length; i++) {
    var divButton = document.createElement("div");
    divButton.setAttribute("class", "d-grid gap-2");
    var cityButton = document.createElement("button");
    cityButton.setAttribute("class", "btn btn-outline-primary btnCity");
    cityButton.setAttribute("type", "button");
    cityButton.textContent = savedArray[i].citySaved;
    savedDisplay.appendChild(divButton);
    divButton.appendChild(cityButton);
  }
}

function clearCurrent() {
  list.innerHTML = "";
}

//function to get data based on user input/submit event
function getWeatherFromUserInput(event) {
  event.preventDefault();
  var cityName = document.querySelector(".city").value;
  getApi(cityName);
  getForecast(cityName);
  saveData();
}

//function to get data based on button click on saved cities
var allCityButtons = document.querySelectorAll(".btnCity");
allCityButtons.forEach(function (each) {
  console.log(each);
  each.addEventListener("click", function (event) {
    let cityName = event.target.textContent;
    console.log(cityName);
    getApi(cityName);
    getForecast(cityName);
  });
});

function getApi(cityName) {
  var requestURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=908496cc17de5b4bf4388de20da136fa";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // Creating elements

      var temperature = document.createElement("li");
      var feelsLike = document.createElement("li");
      var wind = document.createElement("li");
      var humidity = document.createElement("li");

      createHeading.textContent = data.name + " (" + todaysDate + ")";
      temperature.textContent = "Temperature: " + data.main.temp + " degrees F";
      feelsLike.textContent =
        "Feels like: " + data.main.feels_like + " degrees F";
      wind.textContent = "Wind Speed: " + data.wind.speed + " mph";
      humidity.textContent = "Humidity: " + data.main.humidity + " %";

      card.appendChild(createHeading);
      card.appendChild(list);
      list.appendChild(temperature);
      list.appendChild(feelsLike);
      list.appendChild(wind);
      list.appendChild(humidity);
    });

  clearCurrent();
}

function getForecast(cityName) {
  var requestURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=imperial&appid=908496cc17de5b4bf4388de20da136fa";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.search("12:00:00") != -1) {
          var dateObject = data.list[i].dt_txt;
          var dateFormatted = moment(dateObject).format("dddd, MMMM Do");
          var tempDay = data.list[i].main.temp;
          var windDay = data.list[i].wind.speed;
          var humidityDay = data.list[i].main.humidity;
          var iconDay = data.list[i].weather[0].icon;

          var cardRow = document.createElement("div");
          cardRow.setAttribute("class", "card-group");
          cardRow.innerHTML = `
            <div class="card">
            <div class = "card-body">
            <h5 class="card-title">${dateFormatted}</h5>
            <ul class="card-text day-list"></ul>
            <li class="list-unstyled"><img src="https://openweathermap.org/img/w/${iconDay}.png"</img></li>
            <li class="list-unstyled">Temperature: ${tempDay} degrees F</li>
            <li class="list-unstyled">Wind: ${windDay} mph</li>
            <li class="list-unstyled">Humidity: ${humidityDay} %</li>
            </div>
            </div>
          `;

          cardDiv.append(cardRow);
        }
      }
    });
}

//EVENT HANDLERS
searchButton.addEventListener("click", getWeatherFromUserInput);
