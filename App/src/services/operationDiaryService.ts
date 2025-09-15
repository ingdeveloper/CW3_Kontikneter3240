import OperationDiarySource = require("./operationDiarySource");
import OperationDiaryFilter = require("./models/operationDiaryFilter");

class OperationDiaryService {

    public static getWFEvents(filter: OperationDiaryFilter): OperationDiarySource {
        return new OperationDiarySource(filter);
    }

}

export = OperationDiaryService;