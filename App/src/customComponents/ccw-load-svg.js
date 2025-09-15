/*
    Diese Komponente fordert ein SVG per Http-Request an. Wenn es so anfeordert wird, dann kann danach mit dem DOM auf die IDs gearbeitet werden.
    Die erstellte SVG-Datei mit Inscape hat immer eine feste Breite und Höhe. Das wird hier in 100% geändert. Damit ist das SVG responsive geworden.
    Erstellung: 2019-06-07 amueller
	
	<ccw-load-svg params="src: 'ContentCowi/svg/testenSvg.svg', z_index: -1"></ccw-load-svg>
	
	Mit dieser Komponente kann eine SVG-Datei dynamisch geladen werden. Der Zugriff sollte dann über DOM erfolgen. Die Breitenvorgabe sollte mit einem umschließenden DIV erfolgen. 
    Bitte keine Höhenwerte angeben!!!
	
	
	Parameter: src:Pfad zur SVG-Datei;
    Der Zugriff kann per document.getElementById("A") erfolgen. In diesem Beispiel-SVG sind die IDs: 'A', 'B', 'C', 'rect', 'line1', 'line2', 'kreis1'.
	
    Code:
	self.testCcwLoadSvg = self.connector.getSignal('Local Second').value;
    self.testCcwLoadSvg.subscribe(function(newValue) {
        var my = (newValue);
        console.log("Subcribe ccw-load-svg" + my);
        if (document.getElementById("A")) {  //Wenn Element im DOM, sonst "null"
            if (my % 2) {
                document.getElementById("A").style.stroke = 'red';
                document.getElementById("A").style.fill = 'blue';
                console.log(document.getElementById("A").style.stroke);

            } else {
                document.getElementById("A").style.stroke = 'blue';
                document.getElementById("A").style.fill = 'red';
            }
        }
    });

*/


define([],
    function() {

        var ccwLoadSvg = function(params) {
            var self = this;

            self.settings = params;

            self.src = (ko.unwrap(self.settings.src) || '');
            self.z_index = (ko.unwrap(self.settings.z_index) || 0);   //Minusbereich bedeutet weiter nach hinten

            self.xhrRes = ko.observable("load SVG (ccw-load-svg)");

            self.xhr = new XMLHttpRequest();
            self.xhr.onreadystatechange = function(res) {
                if (this.readyState == 4 && this.status == 200) {
                    // self.xhrRes(self.xhr.responseText);
                    var parser = new DOMParser();

                    var xmlDoc = parser.parseFromString(self.xhr.responseText, 'image/svg+xml');
                    var x = xmlDoc.getElementsByTagName('svg')[0];
                    x.setAttribute("width", "100%");
                    x.setAttribute("height", "100%");

                    var xmlText = new XMLSerializer().serializeToString(x);
                    //mit dem XMLSerializer wird aus dem svg -> svg:svg. Warum auch immer. Aber im folgendem wird dieses rückgängig gemacht.
                    var mynewtext = xmlText.replace(/svg:svg/g, "svg");  

                    self.xhrRes(mynewtext);
                }
            };
            self.xhr.open("GET", self.src, false);
            self.xhr.overrideMimeType("image/svg+xml");
            self.xhr.send();

        };

        // Seiter wird verlassen und Komponente zerstört
        ccwLoadSvg.prototype.dispose = function() {
            var self = this;

        };

        return ccwLoadSvg;
    });