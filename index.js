const base_url = "http://api.weatherapi.com/v1/forecast.json"
const api_key = "9d0008c450904b81b71133413260405"

let selected_city = '';
let data;

const city_title_ele = document.getElementById("city-title");
const city_temp_ele = document.getElementById("city-temp");
const city_footer_ele = document.getElementById("city-footer");
const city_humidity_ele = document.getElementById("humidity");
const city_wind_ele = document.getElementById("wind");
const city_uv_ele = document.getElementById("uv");
const city_pressure_ele = document.getElementById("pressure");
const hourly_card_list_ele = document.getElementById("hourly-card-list");
const searchbar_input = document.getElementById("searchbar-input");
const city_status_image_ele = document.getElementById("city-status-image");
const error_container_ele =document.getElementById("error-container");

get_city_data("pune");

async function get_city_data(city) {
    error_container_ele.innerHTML='';
    error_container_ele.style.display='none';
    const url = base_url + "?key=" + api_key + "&q=" + city + "&days=1";
    try {
        const response = await fetch(url);
        console.log(response.status);
        data = await response.json();
        if (response.status == 200) {
            show_city_data();
        } else {
            console.log(data.error);
            error_container_ele.innerHTML=`<span class="error-text">Error : ${data.error["message"]}</span>`;
            error_container_ele.style.display='flex';
        }
    } catch (error) {
        console.log(`error :${error}`);
    }
}
function show_city_data() {
    if (!data) { return }
    city_title_ele.innerText = `${data['location']['name']}, ${data['location']['country']}`;
    city_temp_ele.innerText = `${data['current']['temp_c']}°C`;
    city_footer_ele.innerText = data['current']['condition']['text'];
    city_humidity_ele.innerText = `${data['current']['humidity']}%`;
    city_wind_ele.innerText = `${data['current']['wind_kph']} km/h`;
    city_uv_ele.innerText = `${data['current']['uv']} (${data['current']['uv'] < 5 ? "low" : "high"})`;
    city_pressure_ele.innerText = `${data['current']['pressure_mb']} hPa`;
    city_status_image_ele.innerHTML = `<img src="./assets/status_icon/${get_status_image(data['current']['condition']['code'], data['current']['is_day'])}.png">`;
    show_hourly_temp();
}
function get_status_image(status_code, is_day) {
    switch (status_code) {
        case 1003:
            console.log("status code : 1003");
            return `1003_${is_day ? "d" : "n"}`;
        case 1000:
            return `1000_${is_day ? "d" : "n"}`;
        case 1006:
        case 1009:
            return `1006_${is_day ? "d" : "n"}`;
        case 1030:
            return `1030_d`;
        default:
            return `1063_${is_day ? "d" : "n"}`;
    }
}
function show_hourly_temp() {
    hourly_card_list_ele.innerHTML = '';
    const hour_data = data['forecast']['forecastday'][0]["hour"];
    for (let element of hour_data) {
        const div = document.createElement('div');
        div.className = "hourly-card";
        div.innerHTML = `<span class="card-header">${element['time'].slice(11)}</span>
                        <img src="./assets/status_icon/${get_status_image(element['condition']['code'], element['is_day'])}.png">
                        <span class="card-value">${element['temp_c']}°</span>`
        hourly_card_list_ele.appendChild(div);

    }
}
searchbar_input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const value = event.target.value;
        get_city_data(value);
        event.target.value = '';
    }
});