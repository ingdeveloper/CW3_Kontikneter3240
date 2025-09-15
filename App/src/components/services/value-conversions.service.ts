class ValueConversionsService {

    public linearScale(x: number, xMin: number, xMax: number, yMin: number, yMax: number) {
        //(y - y1) / (x - x1) = (y2 - y1) / (x2-x1)
        x = x * 1;
        xMin = xMin * 1;
        xMax = xMax * 1;
        yMin = yMin * 1;
        yMax = yMax * 1;

        var y = (((yMax - yMin) * (x - xMin)) / (xMax - xMin)) + yMin;
        return y;
    }
}

export = ValueConversionsService;