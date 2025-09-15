import Composition = require("durandal/composition");

class ESmartZoom {
    public static init() {
        Composition.addBindingHandler('esmartzoom');
    }
}

export = ESmartZoom;