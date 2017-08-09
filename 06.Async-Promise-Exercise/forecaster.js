function attachEvents() {
    let baseUrl='https://judgetests.firebaseio.com/';
    $('#submit').click(loadForecast);

    function request(endpoint) {
       return $.ajax({
           method:"GET",
           url:baseUrl+endpoint,
       })
    }
    function loadForecast() {
        request('locations.json')
            .then(displayLocation)
            .catch(handleError)
    }
    function displayLocation(locationsArr) {
        let location=$('#location').val();
        let locationCode=locationsArr
            .filter(loc=>loc['name']===location)
            .map(loc=>loc['code'])[0];
        if(!locationCode){
                handleError();
        }

        let todayForecastPromise=request(`forecast/today/${locationCode}.json`);
        let upcomingForecastPromise=request(`forecast/upcoming/${locationCode}.json`);
        Promise.all([todayForecastPromise,upcomingForecastPromise])
            .then(displayAllForecast)
            .catch(handleError)

    }

    function displayAllForecast([todayWeather,upcomingWeather]) {

        let weatherSymbols={
    	'Sunny':			'&#x2600;', // ☀
    	'Partly sunny':	    '&#x26C5;', // ⛅
    	'Overcast':         '&#x2601;', // ☁
    	'Rain':			    '&#x2614;', // ☂
    	'Degrees':	        '&#176;'   // °
        };
    let forecastDiv=$('#forecast');
        forecastDiv.css('display','block');
        displayToCurrent(todayWeather,weatherSymbols);
        displayToUpcoming(upcomingWeather,weatherSymbols);
    }
    function displayToCurrent(todayWeather,weatherSumbols) {
        let current=$('#current');
        current.empty();
        current.append($('<div class="label">Current conditions</div>'))
               .append($(`<span class="condtion symbol">${weatherSumbols[todayWeather['forecast']['condition']]}</span>`))
               .append($('<span class="condition"></span>')
                .append($(`<span class="forecast-data">${todayWeather['name']}</span>`))
                .append($(`<span class="forecast-data">${todayWeather['forecast']['low']}&#176;/${todayWeather['forecast']['high']}&#176;</span>`))
                .append($(`<span class="forecast-data">${todayWeather['forecast']['condition']}</span>`))
            )

    }
    function displayToUpcoming(upcomingWeather,weatherSymbols) {
    let upcoming=$('#upcoming');
    upcoming.empty();
        upcoming
            .append($('<div class="label">Three-day forecast</div>'));
    let data=upcomingWeather['forecast'];
    for(let info of data) {
       upcoming
            .append($('<span class="upcoming"></span>')
                .append($(`<span class="symbol">${weatherSymbols[info['condition']]}</span>`))
                .append($(`<span class="forecast-data">${info['low']}&#176;/${info['high']}&#176;</span>`))
                .append($(`<span class="forecast-data">${info['condition']}</span>`))
            )
    }
    }
    function handleError() {
        $('#forecast').text('Error');
    }
}
