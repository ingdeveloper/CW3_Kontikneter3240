//Example for the viewModel in TypeScript
import ViewModelBase = require("../viewModelBase");
class Conveyer extends ViewModelBase {

    // public segments: KnockoutObservableArray<
    // {
    //     signalName: KnockoutObservable<string>;
    //     path: KnockoutObservable<string>;
    // }>;

    public segments: KnockoutObservableArray<string>;
    public stackerPath: string;
    public bjPath: string;

    public async activate() {
        this.stackerPath = "M95.982 0v43H29.018V0h66.964zM85.937 31.684V11.316H39.063v20.368h46.874zM83.705 13.58v15.84h-42.41V13.58h42.41zm-56.92 0v15.84H0V13.58h26.786zm98.215 0v15.84H98.214V13.58H125z";
        this.bjPath = "M0 25.185L21.133 0l20.15.32L11.98 35.24 0 25.184z";

        this.segments = ko.observableArray([
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second",
            "Local Second"
        ]);



    };




}
export = Conveyer;