/**
 * Bingind handler for an SVG arc path, without any dependencies for other libraries
 * 
 * @param {string} pathClass = "wf-svg-path";
 * @param {string} svgClass =  "wf-svg-container";
 * @param {number} size = 100
 * @param {number} strokeWidth = 0;
 * @param {number} innerRadius = 25;
 * @param {number} outerRadius = (size - strokeWidth) / 2;
 * @param {number} startAngle = 0;
 * @param {number} endAngle = 90;
 *  
 * **/

function createArcPath(startAngle, endAngle, outerRadius, innerRadius) {
    var unit = (Math.PI * 2) / 360;
    
    var sinAlpha = Math.sin(startAngle * unit);
    var cosAlpha = Math.cos(startAngle * unit);
    var sinBeta = Math.sin(endAngle * unit);
    var cosBeta = Math.cos(endAngle * unit);
  
    var largeArc = (endAngle - startAngle) * unit > Math.PI;
  
    // Calculate coordinates for points P,Q,R,S which define the arc path
    var P = {
      x: outerRadius + (outerRadius * sinAlpha),
      y: outerRadius - (outerRadius * cosAlpha)
    };
  
    var Q = {
      x: outerRadius + (outerRadius * sinBeta),
      y: outerRadius - (outerRadius * cosBeta)
    };
  
    var R = {
      x: outerRadius + (innerRadius * sinBeta),
      y: outerRadius - (innerRadius * cosBeta)
    };
  
    var S = {
      x: outerRadius + (innerRadius * sinAlpha),
      y: outerRadius - (innerRadius * cosAlpha)
    }
  
    return 'M' + P.x + ',' + P.y + ' A' + outerRadius + ',' + outerRadius + ' 0 ' + (largeArc ? '1,1' : '0,1') + ' ' + Q.x + ',' + Q.y + ' L' + R.x + ',' + R.y + ' A' + innerRadius + ',' + innerRadius + ' 0 ' + (largeArc ? '1,0' : '0,0') + ' ' + S.x + ',' + S.y + ' Z';
  }
  
function createSVG(size, strokeWidth,svgClass) {
    
    var svgns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgns, "svg");
    
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("class", svgClass +" overflow-visible");
    svg.setAttribute("viewBox", -strokeWidth/2 + " " + -strokeWidth/2 + " " + size + " " + size);
  
    return svg;
  }
  
  function createPath(strokeWidth, pathClass) {
    var svgns = "http://www.w3.org/2000/svg";
    var path = document.createElementNS(svgns, "path");
    path.setAttribute("class", pathClass);
    path.setAttribute("stroke-width", strokeWidth);
    path.setAttribute("fill", "#eeeeee");
    path.setAttribute("stroke", "#555555");
    return path;
  }


ko.bindingHandlers.svgArc = {
    
    init: function (element, valueAccessor) {
        var options = valueAccessor();
        var element = element;

        var pathClass = options.pathClass || "wf-svg-path";
        var svgClass = options.svgClass || "wf-svg-container";
        var size = options.size || 100
        var strokeWidth = options.strokeWidth || 0;
        var innerRadius = options.innerRadius || 25;
        var outerRadius = options.outerRadius || (size - strokeWidth) / 2;

        var startAngle = options.startAngle || 0;
        var endAngle = options.endAngle || 90;

        var svg = createSVG(size, strokeWidth, svgClass);
        var path = createPath(strokeWidth, pathClass);

        path.setAttribute("d", createArcPath(startAngle, endAngle, outerRadius, innerRadius));
        svg.appendChild(path);

        element.appendChild(svg);

    }
}