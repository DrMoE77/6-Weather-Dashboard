// to make an api call --> we need query parameter (q) & and the API key

var weather = ["Temp: ", "Wind: ", "Humidity: ", "UV Index: "];
var units = [" \xB0F", " MPH", " %", " "];

var APIkey = "a55b7cf85fc3c4c3cb19131e3b85eade";

var cities = []; // to save the previously searched cities in local storage 

var city;

var num = 0;

var listedCities = [] //so as to not repeat cities previously searched

// today's date
const now = moment();
const today = now.format('DD/MM/YYYY');
const today1  = moment().add(1,'days').format('DD/MM/YYYY');
const today2  = moment().add(2,'days').format('DD/MM/YYYY');
const today3  = moment().add(3,'days').format('DD/MM/YYYY');
const today4  = moment().add(4,'days').format('DD/MM/YYYY');
const today5  = moment().add(5,'days').format('DD/MM/YYYY');
var dates = [today1, today2, today3, today4, today5];

var hist = document.getElementById("searchHist");

var whole = document.getElementById("whole");

// saving the data to the local storage
function saveTostorage(type, info) {
  localStorage.setItem(type, info);
}

if(localStorage.length > 0){
  for(var j=0, len=localStorage.length; j<len; j++) {
    var key = localStorage.key(j);
    var value = localStorage[key];
    var divCities = document.createElement("button");
    divCities.setAttribute("class", "prevCities");
    hist.appendChild(divCities);
    var text = document.createTextNode(value);
    divCities.appendChild(text);
  }
}

var elements = hist.getElementsByClassName('prevCities')
var numOfCities = elements.length
if(numOfCities>6){
  hist.removeChild(elements[0]);
}



//getsavedValue();


$(document).ready(function(){
  
      function display(city){

        var queryToday = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=a55b7cf85fc3c4c3cb19131e3b85eade";
        var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=a55b7cf85fc3c4c3cb19131e3b85eade";
        
        //console.log(city);
        var container = document.getElementById("current");
        
        var cityHeader = document.createElement("h5");
        container.appendChild(cityHeader);

        var forecast = document.getElementById("5DayForecast");
        
        fetch(queryToday)
          .then((response) => {
          return response.json();
          })
          .then((data) => {
          console.log(data);

          apiCity = data.name;
          apiTemp = data.main.temp;
          apiWind = data.wind.speed;
          apiHumidity = data.main.humidity;

          // retrieving the UV index
          apiLat = data.coord.lat;
          apiLon = data.coord.lon;

          var queryUV = "https://api.openweathermap.org/data/2.5/uvi?appid=a55b7cf85fc3c4c3cb19131e3b85eade&lat=" + apiLat + "&lon=" + apiLon;

          fetch(queryUV)
          .then((response) => {
          return response.json();
          })
          .then((dataUV) => {
          console.log(dataUV);
          

          apiIndex = dataUV.value

          var apiInfo = [apiTemp, apiWind, apiHumidity, apiIndex]
          
          var textCity = document.createTextNode(apiCity + " (" + today + ")");
          cityHeader.appendChild(textCity);

          var iconImg = document.createElement("img")
          iconImg.setAttribute("class","icons");
          var iconCode = data.weather[0].icon 
          //console.log(iconCode);
          var iconurl = "https://openweathermap.org/img/w/" + iconCode + ".png";
          iconImg.setAttribute("src", iconurl);
          cityHeader.appendChild(iconImg);

          //listedCities.append(apiCity);

          for(var j=0, len=localStorage.length; j<len; j++) {
            var key = localStorage.key(j);
            var value = localStorage[key];
            cities.push(value)
            //console.log(value)
          }

          if(localStorage.length > 0){

            var elements = hist.getElementsByClassName('prevCities')
            var numOfCities = elements.length
            if(numOfCities>6){
              hist.removeChild(elements[0]);
            }
            
            if (cities.includes(apiCity) == false){
              saveTostorage(num,apiCity);
              var divCities = document.createElement("button");
              divCities.setAttribute("class", "prevCities");
              hist.appendChild(divCities);
              var text = document.createTextNode(apiCity);
              divCities.appendChild(text);
            }
            else{
              num--;
            }
            
          }
          else{
            saveTostorage(num,apiCity);
            var divCities = document.createElement("button");
            divCities.setAttribute("class", "prevCities");
            hist.appendChild(divCities);
            var text = document.createTextNode(apiCity);
            divCities.appendChild(text);
          }

          
          //saveTostorage("Date: ", today);
          //saveTostorage("Icon", iconCode);
          //saveTostorage("Temp: ", apiTemp);
          //saveTostorage("Wind: ", apiWind);
          //saveTostorage("Humidity: ", apiHumidity);
          //saveTostorage("UV Index: ", apiIndex);
          
          // display info obtained from the api call
          for(var i=0; i<4; i++){
            var div = document.createElement("div");
            var p = document.createElement("p");
            div.appendChild(p);
            container.appendChild(div);

            var text = weather[i];
            var info = apiInfo[i];
            var unit = units[i];

            var text = document.createTextNode(text + info + unit);
            p.appendChild(text);
            
          }
        });
        });   

        fetch(queryForecast)
          .then((response) => {
          return response.json();
          })
          .then((data1) => {
          console.log(data1);
        
          var foreInfo = [data1.list[0], data1.list[8], data1.list[16], data1.list[24], data1.list[32]];
          
          // display info obtained from the api call
          for(var k=0; k<5; k++){
            var cols = document.createElement("div");
            cols.setAttribute("class","col foreCol");
            forecast.appendChild(cols);
            var span = document.createElement("span");
            cols.appendChild(span);
    
            var date = document.createElement("h5");
            var dateText = document.createTextNode(dates[k]);
            date.appendChild(dateText);
            span.appendChild(date)

            var iconImg1 = document.createElement("img")
            iconImg1.setAttribute("class","icons");
            var iconCode1 = foreInfo[k].weather[0].icon; 
            var iconurl1 = "https://openweathermap.org/img/w/" + iconCode1 + ".png";
            iconImg1.setAttribute("src", iconurl1);
            span.appendChild(iconImg1);

            foreTemp = foreInfo[k].main.temp;
            foreWind = foreInfo[k].wind.speed;
            foreHumidity = foreInfo[k].main.humidity;

            var foreDivTemp = document.createElement("div");
            span.appendChild(foreDivTemp);
            var forePTemp = document.createElement("p");
            foreDivTemp.appendChild(forePTemp);
            var foreTextTemp = document.createTextNode("Temp: " + foreTemp + " \xB0F");
            forePTemp.appendChild(foreTextTemp);

            var foreDivWind = document.createElement("div");
            span.appendChild(foreDivWind);
            var forePWind = document.createElement("p");
            foreDivWind.appendChild(forePWind);
            var foreTextWind = document.createTextNode("Wind: " + foreWind + " MPH");
            forePWind.appendChild(foreTextWind);

            var foreDivHumidity = document.createElement("div");
            span.appendChild(foreDivHumidity);
            var forePHumidity = document.createElement("p");
            foreDivHumidity.appendChild(forePHumidity);
            var foreTextHumidity = document.createTextNode("Humidity: " + foreHumidity + " %");
            forePHumidity.appendChild(foreTextHumidity);
    
          }
    
          });   

    }
      
      $("#searchBtn").click(function(){
        $("#current").empty();
        $("#5DayForecast").empty();
        city = $("#enterCity").val();
        num++;
        display(city);
      });

      $(".prevCities").click(function(){
        $("#current").empty();
        $("#5DayForecast").empty();
        city = $(this).text();
        display(city);
    });
});

