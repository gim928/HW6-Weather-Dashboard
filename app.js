var button = document.querySelector(".btn");
var card = document.querySelector(".card-body");
var list = document.querySelector(".list");
var createHeading = document.querySelector(".card-title");
var todaysDate = moment().format("dddd, MM-DD-YYYY");
var cardDate = moment().format("dddd, MMMM Do");
var forecast = document.getElementById(forecast);
var cardDiv = document.querySelector(".card");
var savedArray = [];

function getApi(event) {
  event.preventDefault();

  var cityName = document.querySelector(".city").value;

  //function to save to local storage
  function storage() {
    if (localStorage.getItem("savedArray")) {
      savedArray = JSON.parse(localStorage.getItem("savedArray"));
    }
    savedArray.push(cityName.value);
    localStorage.setItem("savedArray", JSON.stringify(savedArray));
  }

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

      createHeading.textContent = data.name + "(" + todaysDate + ")";
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
  getForecast();
}

function getForecast() {
  var cityName = document.querySelector(".city").value;
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

          // var cardDay = document.createElement("div");
          // cardDay.setAttribute("class", "card");
          var cardBody = document.createElement("div");
          cardBody.setAttribute("class", "card-body");
          var cardTitle = document.createElement("h5");
          cardTitle.setAttribute("class", "card-title");
          var dayList = document.createElement("ul");
          dayList.setAttribute("class", "day-list");
          var iDay = document.createElement("li");
          var tDay = document.createElement("li");
          var wDay = document.createElement("li");
          var hDay = document.createElement("li");

          iDay.innerHTML = iconDay;
          tDay.textContent = "Temperature: " + tempDay + " degrees F";
          wDay.textContent = "Wind: " + windDay + " mph";
          hDay.textContent = "Humidity: " + humidityDay + " %";
          cardTitle.textContent = dateFormatted;

          cardDiv.appendChild(cardBody);
          cardBody.appendChild(cardTitle);
          cardBody.appendChild(dayList);
          dayList.appendChild(iDay);
          dayList.appendChild(tDay);
          dayList.appendChild(wDay);
          dayList.appendChild(hDay);
        }
      }
    });
}

//EVENT HANDLERS
button.addEventListener("click", getApi);
