//Example for the viewModel in TypeScript
import ViewModelBase = require("./viewModelBase");
class Test extends ViewModelBase {
    private switchTypes = ko.observableArray([
        {switchType:'switch-gear-base'},
        {switchType:'switch-gear-feed'},
        {switchType:'switch-gear-measuments'},
        {switchType:'switch-gear-measuments out'},
        {switchType:'switch-gear-box'},
        {switchType:'switch-gear-box-fuse'},
        {switchType:'switch-gear-box-fuse out'},
        {switchType:'switch-gear-switch closed'},
        {switchType:'switch-gear-switch opened'},
        {switchType:'switch-gear-breaker opened'},
        {switchType:'switch-gear-breaker closed'},
        {switchType:'switch-gear-disconector opened'},
        {switchType:'switch-gear-disconector closed'},
        {switchType:'switch-gear-switch-disconector opened'},
        {switchType:'switch-gear-switch-disconector closed'},
        {switchType:'switch-gear-fuse-disconector opened fuse-blown'},
        {switchType:'switch-gear-fuse-disconector closed fuse-intact'}, 
        {switchType:'switch-gear-fuse-switch-disconector-1 opened fuse-intact'},
        {switchType:'switch-gear-fuse-switch-disconector-1 closed fuse-intact'}, 
        {switchType:'switch-gear-fuse-switch-disconector-2 opened fuse-intact'},
        {switchType:'switch-gear-fuse-switch-disconector-2 closed fuse-blown'}, 
    ]);

    private switchExamples = ko.observableArray([
        {switchType:'switch-gear-feed switch-gear-measuments', state1: 'in green', state2: 'out error'},
        {switchType:'switch-gear-feed switch-gear-box switch-gear-switch', state1: 'closed in green', state2: 'opened out error'},
        {switchType:'switch-gear-base switch-gear-box switch-gear-breaker', state1: 'in closed critical', state2: 'out opened blue'},
        {switchType:'switch-gear-base switch-gear-box switch-gear-switch-disconector', state1: 'closed in green', state2: 'opened out error'},
        {switchType:'switch-gear-base switch-gear-box switch-gear-disconector', state1: 'closed in green', state2: 'opened out error'},
        {switchType:'switch-gear-base switch-gear-box switch-gear-fuse-disconector', state1: 'closed in green fuse-intact', state2: 'opened out error fuse-blown'},

        {switchType:'switch-gear-base switch-gear-box switch-gear-fuse-switch-disconector-1', state1: 'closed in green fuse-intact', state2: 'opened out error fuse-blown'},

        {switchType:'switch-gear-base switch-gear-box-fuse switch-gear-fuse-switch-disconector-2', state1: 'closed in green fuse-intact', state2: 'opened out error fuse-blown'}




        // {switchType:'switch-gear-feed'},
        // {switchType:'switch-gear-measuments'},
        // {switchType:'switch-gear-measuments out'},
        // {switchType:'switch-gear-box'},
        // {switchType:'switch-gear-box-fuse'},
        // {switchType:'switch-gear-box-fuse out'},
        // {switchType:'switch-gear-switch closed'},
        // {switchType:'switch-gear-switch opened'},
        // {switchType:'switch-gear-breaker opened'},
        // {switchType:'switch-gear-breaker closed'},
        // {switchType:'switch-gear-disconector opened'},
        // {switchType:'switch-gear-disconector closed'},
        // {switchType:'switch-gear-switch-disconector opened'},
        // {switchType:'switch-gear-switch-disconector closed'},
        // {switchType:'switch-gear-fuse-disconector opened'},
        // {switchType:'switch-gear-fuse-disconector closed'}, 
        // {switchType:'switch-gear-fuse-switch-disconector-1 opened'},
        // {switchType:'switch-gear-fuse-switch-disconector-1 closed'}, 
        // {switchType:'switch-gear-fuse-switch-disconector-2 opened'},
        // {switchType:'switch-gear-fuse-switch-disconector-2 closed'}, 
    ]);
    


    constructor() {
        super();
    }

    public activate() {

    };

}
export = Test;