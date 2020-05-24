const express = require("express"); //požiadavka na framework node express
const https = require("https"); // natívna fnckcionalita node.js
const bodyParser = require("body-parser"); //tento modul je na čítanie dát od klienta

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
})); //pevný kód, naša appka aby mohla používať moduil bodyParser

app.listen(3000, function() {
  console.log("Server is spinning on port 3000.");
})

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  const apiKey = "bf5d0410500202245b9c1b6de24048e5";
  const query = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric"; //do konštanty (hocijakej) uložiť api https adresu, z ktorej chceme ťahať

  https.get(url, function(response) { //fetch data from exterlan API server; response call back funkcie nemôže byť res, pretože to už máme použité pri GET na náš server od clienta

    console.log(response.statusCode); //aká je odpoveď?
    // tu si zavoláme volaný API server, prečítame statusCOde, či nás prijal (200=ok); potom si dáme z celej odpovede prečítať len "data" a tieto použitím JSON.parse premietneme v JSON formáte; JSON.parse rozbaľuje texty objektov a JSON.strigify ich zase zbaľuje;

    response.on("data", function(data) {

      const weatherData = JSON.parse(data); //tu si otvoríme vďaka JSON formátu objekt z dát, ktoré prišli;
      const temp = weatherData.main.temp; //tu si prečítame presne podľa JSONu konktétny údaj z objektu;
      const feelTemp = weatherData.main.feels_like;

      const icon = weatherData.weather[0].icon;
      const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<h1>Počasie je aktuálne takéto:</h1>");
      res.write("<h2>Teplota v meste " + query + " je: " + temp + " °C...</h2>"); // možno použič veľa writes a jeden send a spčasne môže byť send formátovaný ako html
      res.write("<h1>Pocitová teplota je tam: " + feelTemp + " °C...</h2");
      res.write("<br>");
      res.write("<img src=" + iconUrl + ">");
      res.send();
      // tu použijeme res = response argument v callback funkcii na náš route root get "/" a pošleme na obrazovku klienta informácie;

    });

  });




});
