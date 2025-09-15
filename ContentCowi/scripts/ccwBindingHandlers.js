/*###################################################################################################################
 * ################## COWIE FUNKTIONEN BindigHandlers ###############################################################
 ###################################################################################################################*/
//DateTimePicker
ko.bindingHandlers.ccwDtp = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().dtpOptions || {};
        console.log("--dtp--");
        console.log(options);
        options.icons = {
            time: 'wf wf-clock',
            date: 'wf wf-calendar',
            up: 'wf wf-arrow-metro-o wf-n',
            down: 'wf wf-arrow-metro-o wf-s',
            previous: 'wf wf-arrow-metro wf-w',
            next: 'wf wf-arrow-metro',
            today: 'wf wf-callout-o',
            clear: 'wf wf-clear',
            close: 'wf wf-close-round-o'
        };

        if (options.maxDate && options.maxDate !== null) {
            options.maxDate = ko.unwrap(options.maxDate);
        }
        if (options.minDate && options.minDate !== null) {
            options.minDate = ko.unwrap(options.minDate);
        }

        //options.widgetPositioning = {
        //    horizontal: "auto",
        //    vertical: "bottom"
        //};
        delete options.widgetClass;
        $(element).datetimepicker(); //options
        //$(element).data("DateTimePicker").locale("de");

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).data("DateTimePicker").destroy();
            $(element).off("dp.change");
        });

    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var options = allBindingsAccessor().dtpOptions || {};
        //var myDate = 
        // $(element).data("DateTimePicker").maxDate(ko.unwrap(options.maxDate));
        // $(element).data("DateTimePicker").minDate(ko.unwrap(options.minDate));

        var pickerWidgetClass = options.widgetClass;
        delete options.widgetClass;

        $(element).off("dp.change");

        $(element).datetimepicker();
        //console.log("Update: ");


        $(element).data("DateTimePicker").date(ko.unwrap(value));
        $(element).data("DateTimePicker").locale("de");
        if (options.format)
            $(element).data("DateTimePicker").format(ko.unwrap(options.format));
        if (options.viewMode)
            $(element).data("DateTimePicker").viewMode(ko.unwrap(options.viewMode));
        if (options.calendarWeeks)
            $(element).data("DateTimePicker").calendarWeeks(ko.unwrap(options.calendarWeeks));

        $(element)
            .on("dp.show",
                function (event) {
                    var weeksMode = $(element).data("DateTimePicker").calendarWeeks();
                    weeksMode
                        ?
                        $(".datepicker-days").addClass(pickerWidgetClass) :
                        $(".datepicker-days").removeClass(pickerWidgetClass);
                });

        $(element)
            .on("dp.change",
                function (event) {
                    var date = $(element).data("DateTimePicker").date(); //.toDate();
                    var value = valueAccessor();

                    if (ko.isObservable(value)) {
                        value(date);
                    }
                });

    }
};

// ko.bindingHandlers.ccwHandler = {
//     init: function (element, valueAccessor) {
//         $(element).focus(function () {
//             var value = valueAccessor();
//             value(true);
//         });
//         $(element).blur(function () {
//             var value = valueAccessor();
//             value(false);
//         });
//     },
//     update: function (element, valueAccessor) {
//         var value = valueAccessor();
//         if (ko.unwrap(value))
//             element.focus();
//         else
//             element.blur();
//     }
// };

ko.bindingHandlers.ccwHandler = {
    init: function (element, valueAccessor, allBindings) {
        // console.log("INIT" + element + " / " + valueAccessor());
        // console.log(valueAccessor());
        // var val = allBindings.get('name');
        // console.log("Init:");
        // console.log(val);
        $(element).focus(function () {
            var value = valueAccessor();
            // console.log(value());
            value(value);
        });
        $(element).blur(function () {
            var value = valueAccessor();
            value(value);
        });
    },
    update: function (element, valueAccessor, allBindings) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        // var val = allBindings.get('name');
        // console.log("Update:");
        // console.log(valueUnwrapped);
        // console.log(ko.unwrap(val));
        if (ko.unwrap(value))
            element.focus();
        else
            element.blur();
    }
};


/**
 * This is binding handler open browser in full screen mode by click on element
 * Don't work in IE
 * eg. <i class="wf wf-fullscreen" data-bind="toggleFullScreen: {}"/>
 */
ko.bindingHandlers.ccwToggleFullScreen = {
    init: function (element) {
        if (fullScreenApi.supportsFullScreen) {
            element.addEventListener('click', function () {

                if (!fullScreenApi.isFullScreen()) {
                    fullScreenApi.requestFullScreen(document.documentElement);
                } else {
                    fullScreenApi.cancelFullScreen(document.documentElement);
                }
            }, true);
        }
    }
};

//##################################################################################################################################################
//#############BindingHandler "ccwViewBox" #########################################################################################################
//##################################################################################################################################################
// Update: 11.07.2018 - neu gemacht, weil ein Scrollbalken immer nach rechts angezeigt wurde. amueller
// Update: 23.04.2018 - statt setTimeout wird jetzt setIntervall genommen; Ausführung bis DOM-Element erkennbar ist, bzw. die Breite ermittelt werden kann.
// Update: 29.12.2020 - mit dem Parameter "center: true" kann der Inhalt zentriert ausgerichtet werden.
// Example:
/*
    <ccwViewBox data-bind="ccwViewBox: {}, width: 1000, maxScale: 1.5, center: true">
        <ccwViewBoxContent >
            <div style = "position: absolute; left: 0px; top: 0px; height: 300px;"> ccwViewBox testen </div>
            <div style = "position: absolute; left: 0px; top: 20px; width: 500px; height: 300px; background-color: plum;"></div>
            <div style = "position: absolute; left: 0px; top: 20px; width: 1000px; height: 300px;" </div>
        </ccwViewBoxContent>
    </ccwViewBox>

*/
//@width = Breitenangabe der Zeichnungsfläche
//@maxScale = max. Scalierung (default = 1.5)
//@DOMVerz = Verzögerungszeit (ms) Aufbau des DOM (default = 500)
//@center = Ausrichtung zentriert (amueller 29.12.20202)
ko.bindingHandlers.ccwViewBox = {
    init: function (element, valueAccessor, allBindings) {
        var parWidth = allBindings.get('width'); //Breite von der Zeichnung
        var $parentContainer = $(element);
        $parentContainer.children('ccwViewBoxContent').width(parWidth);
    },
    update: function (element, valueAccessor, allBindings) {
        var parWidth = allBindings.get('width'); //Breite von der Zeichnung
        var parMaxScale = allBindings.get('maxScale') || 1.5; //wenn Parameter nicht angegeben ist, dann ist 1,5 vorgegeben
        var parZeitverz = allBindings.get('DOMVerz') || 500; //DOM - Element in den ersten ms nicht verfügbar, evtl erst nach 500ms. Falls das nicht ausreicht, die Zeit höher stellen
        var parCenter = allBindings.get('center') || false; //wenn Parameter nicht vorhanden, dann ist false vorgegeben
        var $parentContainer = $(element);

        function doResize() {
            // console.log("%cdoResizeAnfang", "background: grey");
            // console.log($parentContainer);
            // console.log(element);


            var contentLeft = $parentContainer.offset().left;
            var contentTop = $parentContainer.offset().top;
            //calculate scale
            var width = $parentContainer.parent().width(); //Math.min($parentContainer.width(), $(window).width());  //Änderung, weil sonst der Scrollbalken nach rechts weit scrollbar ist
            var valParWidth = allBindings.has('width') ? parWidth : width; //wenn Parameter nicht angegeben, dann Breite Container übernehmen
            var scale = Math.min(parMaxScale, width / valParWidth);

            var DomElementVorhanden = false; //Neu 20.04.2018
            //set scale

            // console.log("%cdom aufgebaut", "background: grey");
            if ($parentContainer.length > 0) {
                // console.log("%cdoResize", "background: grey");
                // console.log($parentContainer);
                // $parentContainer.css({
                //     transform: "scale(" + scale + ")"
                // });
                // console.log("Breite sichtbares Fenster:" + $(window).width());
                // console.log("Breite ccwViewBox:" + $parentContainer.width());
                // console.log("Breite ccwViewBoxContent:" + $parentContainer.children('ccwViewBoxContent').width());
                // if (($parentContainer.children('ccwViewBoxContent').width() * scale) > $(window).width()) {
                //     $parentContainer.children('ccwViewBoxContent').width($parentContainer.children('ccwViewBoxContent').width() * -(scale - 1.0));
                //     console.log("Breite angepasst:" + $parentContainer.width());
                // }
                //move content to point before scale
                $parentContainer.children('ccwViewBoxContent').css({
                    transform: "translate(" + (contentLeft - $parentContainer.offset().left) + "px, " + (contentTop - $parentContainer.offset().top) + "px) scale(" + scale + ")"
                });

                //amueller 29.12.2020
                //Den Inhalt zentriert ausrichten
                if (parCenter === true) {
                    $parentContainer.children('ccwViewBoxContent').css("margin", "0 auto").css("transform-origin", "center top");
                };

                //console.log("%ctransform: translate(" + (contentLeft - $parentContainer.offset().left) + "px, " + (contentTop - $parentContainer.offset().top) + "px) scale(" + scale + ")" + "width:" + $parentContainer.width(), "background:yellow");
                // if (scale > 0) DomElementVorhanden = true;
                if ($parentContainer.width() > 0) DomElementVorhanden = true; //neu 11.07.2018 amueller
                // if ($parentContainer.children('ccwViewBoxContent').width() > 0) DomElementVorhanden = true;  //neu 16.11.2019 amueller
                // console.log($parentContainer.children('ccwViewBoxContent').width());

            }


            return DomElementVorhanden;
        }

        //Funktion verzögert aufrufen, damit HTML die Breite & Höhe aufbauen kann, erst danach ist Zugriff auf die Eigenschaften
        var myTimer = setInterval(function () {
            var domElemVorhanden = doResize();
            // console.log("%cSetIntervall", "background: grey");
            // console.log(domElemVorhanden);
            if (domElemVorhanden === true) clearInterval(myTimer); //wenn DOM aufgebaut ist, dann kann Timer gelöscht werden.
        }, parZeitverz); //ausführen einmal nach den ersten 500ms 

        //wird beim ändern der Fenstergröße ausgeführt
        $(window).resize(function () {
            // console.log("%cRESIZE FENSTER", "background: lime");
            doResize();
        });


    }
};

//##################################################################################################################################################
//#############BindingHandler "ccwViewBoxXY" #########################################################################################################
//##################################################################################################################################################
// Update: 23.04.2018 - statt setTimeout wird jetzt setIntervall genommen; Ausführung bis DOM-Element erkennbar ist, bzw. die Breite ermittelt werden kann.
// Example:
//<ccwViewBox data-bind="ccwViewBoxXY: {}, width: 1000, height:800, maxScaleX: 1.5, maxScaleY: 1.5, DOMVerz: 1000, autoScale: true">   ....  </ccwViewBox>
//@width = Breitenangabe der Zeichnungsfläche
//@height = Höhenangabe der Zeichnungsfläche
//@maxScaleX = max. Scalierung Breite (default = 1.5)
//@maxScaleY = max. Scalierung Höhe (default = 1.5)
//@DOMVerz = Verzögerungszeit (ms) Aufbau des DOM (default = 500)
//@autoScale = TRUE or FALSE; Bereich soll sich dem Fenster anpassen.
ko.bindingHandlers.ccwViewBoxXY = {
    update: function (element, valueAccessor, allBindings) {
        var parWidth = allBindings.get('width'); //Breite von der Zeichnung
        var parHeight = allBindings.get('height'); //Breite von der Zeichnung
        var parMaxScaleX = allBindings.get('maxScaleX') || 1.5; //wenn Parameter nicht angegeben ist, dann ist 1,5 vorgegeben
        var parMaxScaleY = allBindings.get('maxScaleY') || 1.5; //wenn Parameter nicht angegeben ist, dann ist 1,5 vorgegeben
        var parZeitverz = allBindings.get('DOMVerz') || 500; //DOM - Element in den ersten ms nicht verfügbar, evtl erst nach 500ms. Falls das nicht ausreicht, die Zeit höher stellen
        var parAutoScale = allBindings.get('autoScale') || false; //Bereich soll sich dem Fenster anpassen.

        var $parentContainer = $(element);

        function doResize() {
            var contentLeft = $parentContainer.offset().left;
            var contentTop = $parentContainer.offset().top;
            //calculate scale
            var width = $parentContainer.width();
            var winWidth = $(window).width();
            var height = $parentContainer.height();
            var winHeight = $(window).height();
            var newHeight = winHeight - contentTop - 55; //55 sind Fußzeile Höhe
            var valParWidth = allBindings.has('width') ? parWidth : width; //wenn Parameter nicht angegeben, dann Breite Container übernehmen
            var valParHeight = allBindings.has('height') ? parHeight : height; //wenn Parameter nicht angegeben, dann Breite Container übernehmen
            var scaleX = Math.min(parMaxScaleX, width / valParWidth);
            var newCalcY = 99; //dieser Wert wird bei der Math.min rausgeworfen
            if (allBindings.has('autoScale') && (parAutoScale == true)) {
                newCalcY = newHeight / valParHeight; //jetzt richtigen Wert berechnen
            }
            var scaleY = Math.min(parMaxScaleY, height / valParHeight, newCalcY);
            console.log("ScaleY: " + scaleY + "|" + parMaxScaleY + "|" + (height / valParHeight) + "|" + (newHeight / valParHeight));
            //move content to point before scale

            var DomElementVorhanden = false; //Neu 23.04.2018

            if ($parentContainer.length > 0) {
                $parentContainer.css({
                    transform: "translate(" + (contentLeft - $parentContainer.offset().left) + "px, " + (contentTop - $parentContainer.offset().top) + "px) scale(" + scaleX + "," + scaleY + ")"
                });
                //console.log("%ctransform: translate(" + (contentLeft - $parentContainer.offset().left) + "px, " + (contentTop - $parentContainer.offset().top) + "px) scale(" + scaleX + "," + scaleY + ")", "background: #FACC2E");
                //console.log("W:" + width + "|" + winWidth + " H:" + height + "|" + winHeight + "|" + newHeight);
                if (scaleX > 0) DomElementVorhanden = true;
            }
            //bei der Angabe des Parameters "autoScale" wird die Container-Größe angepasst
            if (allBindings.has('autoScale')) {
                if (parAutoScale == true) {
                    console.log("autoScale");
                    $parentContainer.css({
                        width: (winWidth - 30) + "px",
                        height: newHeight + "px"
                    });
                }
            }

            return DomElementVorhanden;

        }

        //Funktion verzögert aufrufen, damit HTML die Breite & Höhe aufbauen kann, erst danach ist Zugriff auf die Eigenschaften
        var myTimer = setInterval(function () {
            var domElemVorhanden = doResize();
            if (domElemVorhanden === true) clearInterval(myTimer); //wenn DOM aufgebaut ist, dann kann Timer gelöscht werden.
        }, parZeitverz); //ausführen einmal nach den ersten 500ms 

        //wird beim ändern der Fenstergröße ausgeführt
        $(window).resize(function () {
            // console.log("%cRESIZE FENSTER", "background: lime");
            doResize();
        });


    }
};


/* BindingHandler für Farbumschlag Hintergundfarbe bei einem DIV-Element */
ko.bindingHandlers.ccwBackgrFarbe = {
    update: function (element, valueAccessor, allBindings) {
        var value = valueAccessor();
        //var valueUnwrapped = ko.unwrap(value);
        var farbe1 = allBindings.get('farbe1');
        var farbe2 = allBindings.get('farbe2');

        if (ko.unwrap(value))
            $(element).css("background-color", farbe1);
        else
            $(element).css("background-color", farbe2);
    }
};

/* BindingHandler für Farbumschlag Hintergundfarbe bei einem DIV-Element */
ko.bindingHandlers.ccwBackgrFarbeText = {
    update: function (element, valueAccessor, allBindings) {
        var value = valueAccessor();

        var farbe1 = allBindings.get('farbe1');
        var farbe2 = allBindings.get('farbe2');
        var text1 = allBindings.get('text1');
        var text2 = allBindings.get('text2');
        //console.log("Update: "+ko.unwrap(value));
        if (ko.unwrap(value) & 1) {
            $(element).css("background-color", farbe1);
            $(element).html(text1);
        } else {
            $(element).css("background-color", farbe2);
            $(element).html(text2);
        }
    }
};

/* BindingHandler für Farbumschlag Hintergundfarbe und Click-Funktion bei einem Button-Element */
ko.bindingHandlers.ccwBtnClick = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).click(function () {
            bindingContext.$root.testFunktionFuerClick(); //Übergeordnete Funktion, also auf der HTML-JS-Datei des angebundenen Elementes
        });

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var text1 = allBindings.get('text1');
        var text2 = allBindings.get('text2');
        if (ko.unwrap(value) & 1) {
            $(element).removeClass("btn-default");
            $(element).addClass("btn-danger");
            $(element).html(text1);
        } else {
            $(element).removeClass("btn-danger");
            $(element).addClass("btn-default");
            $(element).html(text2);
        }
        bindingContext.$root.testFunktionFuerAenderung(); //Übergeordnete Funktion, also auf der HTML-JS-Datei des angebundenen Elementes

    }
};


/* BindingHandler für Farbumschlag und Textänderung bei einem Button-Element */
ko.bindingHandlers.ccwBtnFarbe = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var value = valueAccessor();

        var text0 = allBindings.get('text0');
        var text1 = allBindings.get('text1') || text0; //wenn Text2 nicht vorgegeben ist, dann Text1 nehmen
        var css0 = allBindings.get('css0');
        var css1 = allBindings.get('css1') || css0;

        if (ko.unwrap(value) & 1) {
            $(element).removeClass(css0);
            $(element).addClass(css1);
            $(element).html(text1);
        } else {
            $(element).removeClass(css1);
            $(element).addClass(css0);
            $(element).html(text0);
        }

    }
};


/* BindingHandler für verschiebbare Elemente 
    Wichtig: Bitte KEIN Margin-Style für dieses Element eintragen, sonst verschiebt es sich aus dem Fenster !!!

    Beispiel:
    <div class="modal-content" style="left:0px;top:50px;width:auto;height:auto" data-bind="ccwDraggable:{}, dragId: 'titleBar1', BGclose: true, ESCclose: true">
    
    Parameter:
    dragId: Die hier angegebene ID wird zum Verschieben des Elements verwendet (z.B. Kopfzeile eines Dialogs). Wenn nicht definiert, wird das Element selbst verwendet.
    BGclose: Mit true/false wird im Falle eines Dialogs mit Mausclick auf den Hintergrund der Dialog geschlossen. Wenn nicht definiert, false.
    ESCclose: Mit true/false wird im Falle eines Dialogs mit der ESC-Taste der Dialog geschlossen. Wenn nicht definiert, false.
*/
ko.bindingHandlers.ccwDraggable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var modalContentID = uuid.v4();
        var dragId = allBindings.get('dragId');
        var BGclose = (allBindings.get('BGclose') !== undefined) ? allBindings.get('BGclose') : false;
        var ESCclose = (allBindings.get('ESCclose') !== undefined) ? allBindings.get('ESCclose') : false;

        $(element).attr("id", modalContentID);

        // $(element).on("click", function () {
        //     alert('ccwDraggable');
        // });

        if ((dragId !== undefined) && (dragId !== null) && (dragId !== '')) {
            $("#" + dragId).addClass("ccw-draggable");
        }

        if (BGclose == true) {
            $("#" + modalContentID).on("click", function (event) {
                event.stopPropagation();
            });
            $(".modalHost").on("click", function () {
                viewModel.close();
            });
        }

        if (ESCclose == true) {
            $(document).on("keydown", function (event) {
                if (event.code == "Escape") {
                    viewModel.close();
                }
            });
        }

    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var dragId = allBindings.get('dragId');

        function dragElement(elmnt) {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;

            if ((dragId !== undefined) && (dragId !== null) && (dragId !== '')) {
                document.getElementById(dragId).onmousedown = dragMouseDown;
            } else {
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;

            }

            function elementDrag(e) {
                e = e || window.event;
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        dragElement(element);

    }
};

/* BindingHandler für Farbumschlag Hintergundfarbe und Click-Funktion bei einem Button-Element */
ko.bindingHandlers.ccwRahmen = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).mouseenter(function () {
            // console.log ("Mouseover");        
            //bindingContext.$root.testFunktionFuerClick();   //Übergeordnete Funktion, also auf der HTML-JS-Datei des angebundenen Elementes        
            //     $(element).removeClass("btn-default");            
            $(element).addClass("ccw-Rahmen1");
            $(element).removeClass("ccw-Rahmen0");
        });

        $(element).mouseout(function () {
            // console.log ("Mouseout");        
            //bindingContext.$root.testFunktionFuerClick();   //Übergeordnete Funktion, also auf der HTML-JS-Datei des angebundenen Elementes        
            //     $(element).removeClass("btn-default");  
            $(element).addClass("ccw-Rahmen0");
            $(element).removeClass("ccw-Rahmen1");
        });
    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var text1 = allBindings.get('text1');
        var text2 = allBindings.get('text2');
        // if (ko.unwrap(value) & 1) {            
        //     $(element).removeClass("btn-default");            
        //     $(element).addClass("btn-danger");            
        //     $(element).html(text1);        
        // } else {            
        //     $(element).removeClass("btn-danger");            
        //     $(element).addClass("btn-default");           
        //      $(element).html(text2);        
        //     }        
        //     bindingContext.$root.testFunktionFuerAenderung();  //Übergeordnete Funktion, also auf der HTML-JS-Datei des angebundenen Elementes    
    }
};

/* BindingHandler für die automatische Höhenregelung eines DIVs */
ko.bindingHandlers.ccwAutoDivHeight = {
    update: function (element, valueAccessor, allBindings) {
        var parZeitverz = allBindings.get('DOMVerz') || 500; //DOM - Element in den ersten ms nicht verfügbar, evtl erst nach 500ms. Falls das nicht ausreicht, die Zeit höher stellen

        var $parentContainer = $(element);

        function doResize() {
            var contentTop = $parentContainer.offset().top;
            var winHeight = $(window).height();
            var newHeight = winHeight - contentTop - 55; //55 sind Fußzeile Höhe
            var DomElementVorhanden = false; //Neu 23.04.2018

            console.log("ccwAutoDivHeight");
            $parentContainer.css({
                height: newHeight + "px"
            });

            if (newHeight > 0) DomElementVorhanden = true;

            return DomElementVorhanden;
        }

        //Funktion verzögert aufrufen, damit HTML die Breite & Höhe aufbauen kann, erst danach ist Zugriff auf die Eigenschaften
        var myTimer = setInterval(function () {
            var domElemVorhanden = doResize();
            if (domElemVorhanden === true) clearInterval(myTimer); //wenn DOM aufgebaut ist, dann kann Timer gelöscht werden.
        }, parZeitverz); //ausführen einmal nach den ersten 500ms 

        //wird beim ändern der Fenstergröße ausgeführt
        $(window).resize(function () {
            // console.log("%cRESIZE FENSTER", "background: lime");
            doResize();
        });


    }
};

/* BindingHandler für die Anzeige des Signalnamens durch Rechtsclick auf das Element */
/* <span data-bind="text: @VariablenWert, ccwSignalInfo: {}, signalName: @VariablenNamen"></span> */
ko.bindingHandlers.ccwSignalInfo = {
    counter: 0,
    prefix: "contextID_",

    update: function (element, valueAccessor, allBindings) {

        var sigName = allBindings.get('signalName');
        var tooltipText = allBindings.get('tooltipText'); //wenn nicht angegeben, dann undefined

        if ((tooltipText !== undefined) && (tooltipText.length > 0)) {
            $(element).attr("data-toggle", "tooltip");
            $(element).attr("title", tooltipText);
            $(element).css("cursor", "help");
        }

        var value = valueAccessor();
        value.id = value.id || ko.bindingHandlers.ccwSignalInfo.prefix + (++ko.bindingHandlers.ccwSignalInfo.counter);

        element.id = value.id;

        $(`#${element.id}`).attr("params", `signalName: '${sigName}'`).addClass("ccw_context");

        // console.log('%c' + element.id + ' | ' + element.tagName + ' | ' + sigName, 'color: blue');
        // $(element).contextmenu(function () {
        //     toastr.info('Signal: ' + sigName);
        //     return false;
        // });
    }
};

/* BindingHandler zum markieren des aufrufenden und bei "id" angegebenen Elements in angegebener Farbe, wenn der Mauszeiger über das aufrufende Element bewegt wird. */
/* Die Markierung der Elemente erfolgt über die Hintergrundfarbe. */
/* Wird keine Farbe angegeben, ist die Farbe "aqua" (türkisblau) aktiv. */

/* Parameter */
/* id:  id-Name des Objektes, welches zusätzlich zum aufrufenden Element markiert wird, wenn der Mauszeiger über das aufrufende Element bewegt wird. Angabe erforderlich. */
/* markOff: deaktiviert die komplette Markierfunktion. Angabe nicht erforderlich. */
/* colorElement: Angabe der Farbe, in der das aufrufende Element markiert wird. "off" deaktiviert diese Farbe. Angabe nicht erforderlich. */
/* colorId:  Angabe der Farbe, in der das unter id angegebene Objekt markiert wird. "off" deaktiviert diese Farbe. Angabe nicht erforderlich. */

/* Beispiele */
/* <span data-bind="ccwMarkObject: {}, id: 'idName'"></span> --- Standardangabe, beide Objekte werden in türkisblau markiert, sobald sich der Mauszeiger über dem Aufrufenden Element befindet. --- */
/* <span data-bind="ccwMarkObject: {}, id: 'idName', markOff: true"></span> --- Funktion komplett deaktiviert. --- */
/* <span data-bind="ccwMarkObject: {}, id: 'idName', colorElement: 'off', colorId: '#00ff00'"></span> --- Das aufrufende Element wird nicht markiert, sondern nur das unter id angegebene Objekt. --- */
/* <span data-bind="ccwMarkObject: {}, id: 'idName', colorElement: '#ff0000', colorId: '#0000ff'"></span> --- Das aufrufende Element wird in rot, das unter id angegebene Objekt in blau markiert. --- */
ko.bindingHandlers.ccwMarkObject = {
    update: function (element, valueAccessor, allBindings) {
        var idName = allBindings.get('id');
        var disabled = allBindings.get('markOff');
        var colorElement = allBindings.get('colorElement');
        var colorId = allBindings.get('colorId');
        var color1;
        var color2;

        if (colorElement !== undefined) {
            color1 = colorElement;
        } else {
            color1 = "aqua";
        }

        if (colorId !== undefined) {
            color2 = colorId;
        } else {
            color2 = "aqua";
        }

        if (disabled !== true) {
            var oldValueElement = $(element).css("background-color");
            var oldValueId = $("#" + idName).css("background-color");

            $(element).mouseover(function () {
                if (color1.toLowerCase() !== "off") {
                    $(element).css("background-color", color1);
                }
                if (color2.toLowerCase() !== "off") {
                    $("#" + idName).css("background-color", color2);
                }
            });

            $(element).mouseout(function () {
                if (color1.toLowerCase() !== "off") {
                    $(element).css("background-color", oldValueElement);
                }
                if (color2.toLowerCase() !== "off") {
                    $("#" + idName).css("background-color", oldValueId);
                }
            });
        }
    }
};


// mit diesem binding wird der Schriftzug Blau, nicht der Hintergrund
ko.bindingHandlers.ccwMarkObjectcolor = {
    update: function (element, valueAccessor, allBindings) {
        var idName = allBindings.get('id');
        var disabled = allBindings.get('markOff');
        var colorElement = allBindings.get('colorElement');
        var colorId = allBindings.get('colorId');
        var color1;
        var color2;

        if (colorElement !== undefined) {
            color1 = colorElement;
        } else {
            color1 = "aqua";
        }

        if (colorId !== undefined) {
            color2 = colorId;
        } else {
            color2 = "aqua";
        }

        if (disabled !== true) {
            var oldValueElement = $(element).css("background-color");
            var oldValueId = $("#" + idName).css("background-color");
            var oldValuecolorId = $("#" + idName).css("color");

            $(element).mouseover(function () {
                if (color1.toLowerCase() !== "off") {
                    $(element).css("background-color", color1).css("color", color1);
                }
                if (color2.toLowerCase() !== "off") {
                    $("#" + idName).css("background-color", color2).css("color", color1);
                }
            });

            $(element).mouseout(function () {
                if (color1.toLowerCase() !== "off") {
                    $(element).css("background-color", oldValueElement).css("color", oldValuecolorId);
                }
                if (color2.toLowerCase() !== "off") {
                    $("#" + idName).css("background-color", oldValueId).css("color", oldValuecolorId);
                }
            });
        }
    }
};

/***************************************************************************************
// Mit diesem binding wird ein Text mit der passenden ID sichtbar gemacht
***************************************************************************************/
ko.bindingHandlers.ccwMarkObjectvisible = {
    update: function (element, valueAccessor, allBindings) {
        var idName = allBindings.get('id');
        $(element).mouseover(function () {
            $("#" + idName).css("visibility", 'visible');
        });
        $(element).mouseout(function () {
            $("#" + idName).css("visibility", 'hidden');
        });
    }
};

/* BindingHandler für die Anzeige eines größeren Bildes über die ganze Seite */
/*
<div data-bind="ccwImageBox: {}, imgUrl: './ContentCowi/images/CC&W_Logo_kurz_links_transparent.png'">
  <img src="./ContentCowi/images/CC&W_Logo_kurz_links_transparent.png" width="100" class="img-responsive" alt="Bild Flagge"/>
</div>
*/
/* @imgUrl = Pfad zur IMG-Datei */
ko.bindingHandlers.ccwImageBox = {
    update: function (element, valueAccessor, allBindings) {
        var imgUrl = allBindings.get('imgUrl');
        var s = true; //Die Variable ist eine Instance
        var cHeight = window.innerHeight - 90; //Abstand von oben und unten subtrahieren

        $(element).click(function () {
            if (s) {
                s = false;
                var elem = $('#content.main'); //Das ElternElement suchen
                var paddingLR = parseInt(elem.css("paddingLeft")) + parseInt(elem.css("paddingRight"));
                var cWidth = elem.innerWidth() - paddingLR - 50;
                var cLeft = parseInt(elem.css("marginLeft")) + parseInt(elem.css("paddingLeft")) + 25;
                $(element).append("<div id='ccwImageBoxId'></div>"); //ein IMG-Element erstellen und in dem Inhalt zufügen
                $('#ccwImageBoxId').css("margin", "10px auto").css("position", "fixed").css("top", "8px").css("left", cLeft + "px").css("width", cWidth + "px").css("height", cHeight + "px").css("background-color", "#D8D8D8").css("z-index", "30000");
                $('#ccwImageBoxId').css("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
                $('#ccwImageBoxId').append("<img src='" + imgUrl + "' max-width='" + cWidth + "' alt='Bild' style='position: absolute; top: -9999px; bottom: -9999px; left: -9999px; right: -9999px; margin: auto;'>");
            } else {
                s = true;
                $('#ccwImageBoxId').remove();
            }
        });
    }
};

/* BindingHandler für die Anzeige eines Popover's mit dem Artikeltext  */
/*
data - bind = "ccwGetArtikelBezeichnung: {}, placement:'auto right'"
*/
/* @placement = Optional */
ko.bindingHandlers.ccwGetArtikelBezeichnung = {

    update: function (element, valueAccessor, allBindings) {
        var placement = allBindings.get('placement'); //top | bottom | left | right | auto
        var place;
        if (placement != undefined) {
            place = placement;
        } else {
            place = "right auto";
        }

        $(element).mousedown(function () {
            var inhalt = JSON.parse($(element).text()); //Text aus dem berührtem Feld lesen und Leerzeichen entfernen

            if ((inhalt.length <= 7) || (inhalt < 10000000)) {
                inhalt = inhalt + "00";
            }

            var resp;
            $.ajax({
                method: "GET",
                // url: window.resolveUrl("/WsCcw/WsCcw.svc/js/ccwGetKompBezeichnung"),
                url: "https://app-visu-01-p/WsCcw/WsCcw.svc/js/ccwGetKompBezeichnung?artikelnr=" + inhalt,
                // data: JSON.stringify(obj),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.ccwGetKompBezeichnungDwhResult.Bezeichnung.length > 0) {
                        resp = data.ccwGetKompBezeichnungDwhResult.Bezeichnung;
                    } else {
                        resp = "Der Artikeltext für die Nummer ist leider nicht verfügbar!";
                    }
                },
                error: function () {
                    resp = "Fehler bei Komponentenanfrage!"; //Im Fehlerfall ausgeben
                },
                complete: function () {
                    $(element).attr("data-toggle", "popover");
                    $(element).attr("data-trigger", "focus");
                    $(element).attr("data-title", "Artikelbezeichnung");
                    $(element).attr("data-content", resp);
                    $(element).attr("data-container", 'body');

                    if (placement != undefined) {
                        $(element).attr("data-placement", place);
                    } else {
                        $(element).attr("data-placement", "auto right");
                    }
                    $(element).popover('show');

                }
            });
        });
        $(element).mouseup(function () {
            // $(element).removeAttr("data-toggle");
            // $(element).removeAttr("data-trigger");
            // $(element).removeAttr("data-title");
            // $(element).removeAttr("data-content");
            // $(element).removeAttr("data-placement");
            // $(element).removeAttr("data-container");
            $(element).popover('hide');
        });
        // Wenn ein Popover-Fenster stehen bleiben sollte, dann mit Click auf Hauptfenster das Popover schließen
        $("#main-wrapper").click(function () {
            // $(element).removeAttr("data-toggle");
            // $(element).removeAttr("data-trigger");
            // $(element).removeAttr("data-title");
            // $(element).removeAttr("data-content");
            // $(element).removeAttr("data-placement");
            // $(element).removeAttr("data-container");
            $(element).popover('hide');
        });

    }
};

/* BindingHandler für die Anzeige eines Popover's mit dem Artikeltext, HIER per WebService auf dem WF-Server*/
/*
data - bind = "ccwGetArtikelBezeichnungWs: {}, placement:'auto right', fuell9Stellen: true"
*/
/* @placement = Optional */
ko.bindingHandlers.ccwGetArtikelBezeichnungWs = {

    update: function (element, valueAccessor, allBindings) {
        var placement = allBindings.get('placement'); //top | bottom | left | right | auto
        var place;
        var fuell9Stellen = allBindings.get('fuell9Stellen') !== undefined ? allBindings.get('fuell9Stellen') : false;
        if (placement != undefined) {
            place = placement;
        } else {
            place = "right auto";
        }

        $(element).mousedown(function () {
            var inhalt = JSON.parse($(element).text()); //Text aus dem berührtem Feld lesen und Leerzeichen entfernen
            if (fuell9Stellen) {
                inhalt = (numeral(inhalt).format('000000000')); //mit Nullen am Anfang auffüllen
            }

            if (((inhalt.length <= 7) || (inhalt < 10000000))&& !fuell9Stellen) {
                inhalt = inhalt + "00";
            }

            var resp;
            var obj = {
                artikelnr: inhalt
            };
            $.ajax({
                method: "GET",
                // url: window.resolveUrl("/WsCcw/WsCcw.svc/js/ccwGetKompBezeichnung"),
                url: "https://app-visu-01-p/WsCcw/WsCcw.svc/js/ccwGetKompBezeichnung?artikelnr=" + obj.artikelnr,
                // data: JSON.stringify(obj),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.ccwGetKompBezeichnungDwhResult.Bezeichnung.length > 0) {
                        resp = data.ccwGetKompBezeichnungDwhResult.Bezeichnung;
                    } else {
                        resp = "Der Artikeltext für die Nummer ist leider nicht verfügbar!";
                    }
                },
                error: function () {
                    resp = "Fehler bei Komponentenanfrage!"; //Im Fehlerfall ausgeben
                },
                complete: function () {
                    $(element).attr("data-toggle", "popover");
                    $(element).attr("data-trigger", "focus");
                    $(element).attr("data-title", "Artikelbezeichnung");
                    $(element).attr("data-content", resp);
                    $(element).attr("data-container", 'body');

                    if (placement != undefined) {
                        $(element).attr("data-placement", place);
                    } else {
                        $(element).attr("data-placement", "auto right");
                    }
                    $(element).popover('show');

                }
            });
        });
        $(element).mouseup(function () {
            // $(element).removeAttr("data-toggle");
            // $(element).removeAttr("data-trigger");
            // $(element).removeAttr("data-title");
            // $(element).removeAttr("data-content");
            // $(element).removeAttr("data-placement");
            // $(element).removeAttr("data-container");
            $(element).popover('hide');
        });
        // Wenn ein Popover-Fenster stehen bleiben sollte, dann mit Click auf Hauptfenster das Popover schließen
        $("#main-wrapper").click(function () {
            // $(element).removeAttr("data-toggle");
            // $(element).removeAttr("data-trigger");
            // $(element).removeAttr("data-title");
            // $(element).removeAttr("data-content");
            // $(element).removeAttr("data-placement");
            // $(element).removeAttr("data-container");
            $(element).popover('hide');
        });

    }
};


//#####################################################################################################################################################################
// BindingHandler für die Anzeige des Artikeltextes, Übergabe der Artikelnummer per ko.observable(123456789)
// data-bind = "ccwGetArtikelBezeichnungVonNummer: artikelNrSoftMText(), fuell9Stellen: true"
//#####################################################################################################################################################################
ko.bindingHandlers.ccwGetArtikelBezeichnungVonNummer = {
    update: function (element, valueAccessor, allBindings) {
        var fuell9Stellen = allBindings.get('fuell9Stellen') !== undefined ? allBindings.get('fuell9Stellen') : false;
        var nummer = (ko.unwrap(valueAccessor())); //Artikel-Nummer aus Parameter lesen
        //soll die Artikelnummer mit 0 aufgefüllt werden, Parameterübergabe FALSE/TRUE
        if (fuell9Stellen) {
            nummer = (numeral(nummer).format('000000000')); //mit Nullen am Anfang auffüllen
        }
        //ist die Zahl kleiner 7 Stellen, dann auffüllen
        if (((nummer.length <= 7) || (nummer < 10000000)) && !fuell9Stellen) {
            nummer = nummer + "00";
        }
        var resp;
        //obj ist POST-Übergabe
        var obj = {
            artikelnr: nummer
        };
        if ((nummer != "000000000") && (nummer != "0000000")) {
            $.ajax({
                method: "GET",
                // url: window.resolveUrl("/WsCcw/WsCcw.svc/js/ccwGetKompBezeichnung"),
                url: "https://app-visu-01-p/WsCcw/WsCcw.svc/js/ccwGetKompBezeichnung?artikelnr=" + obj.artikelnr,
                // data: JSON.stringify(obj),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.ccwGetKompBezeichnungDwhResult.Bezeichnung.length > 0) {
                        resp = data.ccwGetKompBezeichnungDwhResult.Bezeichnung;
                    } else {
                        resp = "";
                    }
                },
                error: function () {
                    resp = "Fehler bei Komponentenanfrage!"; //Im Fehlerfall ausgeben
                },
                complete: function () {
                    var str = resp.trim(); //Leerzeichen am Anfang und Ende entfernen
                    $(element).html(str);
                }
            });
        }
    }
};

/* BindingHandler für die Anzeige des Textes oder der Klasse durch onmouseover auf das Element zur Anzeige auf ein anderes objekt z.B Textarea */
/* <span data-bind="ccwInfoBox: {}, textInfoBox: @text, infoBoxId: @#id"></span> */
ko.bindingHandlers.ccwInfoBox = {
    update: function (element, valueAccessor, allBindings) {
        var textInfoBox = allBindings.get('textInfoBox'); //
        var infoBoxId = allBindings.get('infoBoxId'); //wenn nicht angegeben, dann undefined //   # =ID  //  . =class 

        $(element).mouseover(function () {
            $(infoBoxId).html(textInfoBox);
            return false;
        });

        $(element).mouseout(function () {
            $(infoBoxId).html('');
            return false;
        });
    }
};

//setFocus: das Input-Feld wird komplett markiert, um die Eingabe schneller starten zu können
//Beispiel: data-bind="setFocus: {}"
ko.bindingHandlers.setFocus = {
    init: function (element, valueAccessor) {
        $(element).on('focus', function () {
            $(element).trigger("select");
        });

    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();

    }
};



//=================================================================================================
// ccw_progress für ccw-wf-bargraph-Komponente 
//================================================================================================= 
ko.bindingHandlers.ccw_progress = {
    counter: 0,
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element);

        var guid = "__ccwpb__" + (++ko.bindingHandlers.ccw_progress.counter);

        $element.attr('id', guid)
            .addClass('progress')
    },
};


/* BindingHandler für ein Format einer Uhrzeit */
/*
data-bind = "ccwFormatDateTime: {}, format: 'DD.MM.YYYY HH:mm:ss'"
*/
/* @format = siehe moment.js Dokumentation */
ko.bindingHandlers.ccwFormatDateTime = {
    update: function (element, valueAccessor, allBindings) {
        var format = allBindings.get('format') || "DD.MM.YYYY HH:mm:ss"; //
        var inhalt = $(element).text(); //Text aus dem berührtem Feld lesen und Leerzeichen entfernen
        // console.log(inhalt, format);
        $(element).text(moment(inhalt).format(format));
    }
};

/* BindingHandler für ein Format einer Uhrzeit */
/*
data-bind = "ccwFormatDateTimeVonInhalt: {}, inhalt: $data.dt, format: 'DD.MM.YYYY HH:mm:ss'"
*/
/* @format = siehe moment.js Dokumentation */
ko.bindingHandlers.ccwFormatDateTimeVonInhalt = {
    update: function (element, valueAccessor, allBindings) {
        var format = allBindings.get('format') || "DD.MM.YYYY HH:mm:ss"; //
        var inhalt = allBindings.get('inhalt') || "";
        //console.log(inhalt, format);
        if (inhalt === undefined || inhalt === null || inhalt === "n/a" || inhalt === "") {
            $(element).text("----");    // Leerzeichen am Anfang und Ende entfernen
            return;
        }
        $(element).text(moment(inhalt).format(format));
    }
};