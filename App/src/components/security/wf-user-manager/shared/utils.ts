export class Utils {

    constructor() { }


    static isNullOrUndefined(value) {
        return value === undefined || value === null;
    }

    static isNullUndefOrEmpty(value) {
        return value === undefined || value === null || value.toString().trim() === '';
    }

    static filterArray(arrayData, property, value) {
        return arrayData.filter(item => Utils.getObjValue(item[property]).toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1);
    }

    static getObjValue(value) {
        if (ko.isObservable(value)) {
            return value();
        } else {
            return value;
        }
    }

    static filterArrayMultiple(arrayData: any[], properties: string[], value: any) {
        return arrayData.filter(item => {
            for (let i = 0; i < properties.length; i++) {
                let property = properties[i];
                if (Utils.getObjValue(item[property]).toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1) {
                    return true;
                }
            }
            return false;
        });
    }

    // sort array by field and criteria descending/ascending
    // default order is ascending
    static sortArray(property, descending?) {
        return function (a, b) {
            let a_value = Utils.getObjValue(a[property]);
            let b_value = Utils.getObjValue(b[property]);

            let value1 = !Utils.isNullOrUndefined(a_value) ? a_value.toString().toLowerCase() : a_value;
            let value2 = !Utils.isNullOrUndefined(b_value) ? b_value.toString().toLowerCase() : b_value;

            if (value1 < value2) {
                return (descending) ? 1 : -1;
            }
            if (value1 > value2) {
                return (descending) ? -1 : 1;
            }
            return 0;
        };
    }

    static findObjInArray(arrayData, property, value) {
        for (let i = 0; i < arrayData.length; i++) {
            if (arrayData[i][property] === value) {
                return arrayData[i];
            }
        }
        return null;
    }

    static findIndexInArray(arrayData, property, value) {
        for (let i = 0; i < arrayData.length; i++) {
            if (arrayData[i][property] === value) {
                return i;
            }
        }
        return -1;
    }

    static removeObjectFromArray(arrayData, property, value) {
        var searchIndex = -1;

        for (let i = 0; i < arrayData.length; i++) {
            var objValue = arrayData[i][property];

            if (objValue === value) {
                searchIndex = i;
                break;
            }
        }
        if (searchIndex > -1) { arrayData.splice(searchIndex, 1); }
    }

}
