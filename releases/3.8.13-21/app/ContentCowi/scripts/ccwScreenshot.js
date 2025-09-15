//####################################################################################
// ccwScreenshot.js
// Ein Abbild vom Browser-Fenster machen. Das Bild wird dann im Downloadbereich des Browsers abgelegt
//####################################################################################
var ccwGetScreenshot = function () {
    html2canvas(document.body).then(function (canvas) {
        // Export the canvas to its data URI representation
        var base64image = canvas.toDataURL("image/png");
        //self.download(base64image, 'bild.png');

        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = base64image;
            var d = new Date();
            var dStr = d.getFullYear().toString() + numeral(d.getMonth()+1).format('00') + numeral(d.getDate()).format('00') + "_" + numeral(d.getHours()).format('00') + numeral(d.getMinutes()).format('00'); 
            link.download = 'screenshot' + dStr + '.jpg';
            //Firefox requires the link to be in the body
            document.body.appendChild(link);
            //simulate click
            link.click();
            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    });
}
