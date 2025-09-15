//Used in toutorial
import HttpService = require("../../../services/http");

//-- F�r ASP Anfrage --
interface RespWebSite {
    data: String;
}

class WebserviceLog {

    getAspLogdataSite(url:string) {
        return HttpService.get(url)
            .then((response: RespWebSite) => {
                //console.info(response);
                return response; 
            });
    }
    getAspRezeptInfo(url: string) {    //Rezept-Info laden
        return HttpService.get(url)
            .then((response: RespWebSite) => {
                //console.info(response);
                return response;
            })
            .catch((err) => {  //bei Fehlerfall
               //console.info(err);
               return err;
            });
    }
    getAspLocal(urlLocal: string, urlRemote: string, queryStrings: string) {    //Rezept-Info laden
        return HttpService.get(urlLocal + '?urlRemote=' + urlRemote + '&queryStrings=' + queryStrings)
            .then((response: RespWebSite) => {
                //console.info(response);
                return response;
            })
            .catch((err) => {  //bei Fehlerfall
                //console.info(err);
                return err;
            });
    }
	getAsp(url: string) {    //Rezept-Info laden
			return HttpService.get(url)
				.then((response: RespWebSite) => {
					// console.info(response);
					return response;
				})
				.catch((err) => {  //bei Fehlerfall
					// console.info(err);
					return err;
				});
    }


}

export = WebserviceLog;