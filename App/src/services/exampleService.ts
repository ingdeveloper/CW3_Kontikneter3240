//Used in toutorial
import HttpService = require("./http");

interface IVersionsDTO {
    Assembly: IVersionDTO;
    File: IVersionDTO;
}

interface IVersionDTO {
    Build: number;
    Major: number;
    Minor: number;
    Revision: number;
}

class ExampleService {

    getScadaVersion() {
        const url = `/_SERVICES/WebServices/WCF/UtilityServices.svc/js/GetCurrentVersion`;

        return HttpService.post(url)
            .then((response: { d: IVersionsDTO }) => {
                return response.d;
            });
    }

    getWeather(city: string = null, apiKey: string = null) {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}}&APPID=${apiKey}`;

        return HttpService.get(url)
            .then((response) => {
                return response;
            });
    }
}

export = ExampleService;