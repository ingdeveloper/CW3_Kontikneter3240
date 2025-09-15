import widget = require('plugins/widget');

class PluginRegistry {
    constructor(basePath: string) {
        this.basePath = basePath;

        console.info('Setting plugin registry root: ' + basePath);

    }

    public map(name: string): PluginRegistry {
        var viewPath = `${this.basePath}/${name}/view`;
        var viewModelPath = `${this.basePath}/${name}/viewmodel`;
        widget.mapKind(name, viewPath, viewModelPath);
        this.kinds.push(name);
        return this;
    }

    public mapComponent(name: string, viewName?: string, viewModelName?: string): PluginRegistry {
        viewName = viewName || name;
        viewModelName = viewModelName || viewName;
        const viewPath = `text!${this.basePath}/${viewName}.html`;
        const viewModelPath = `${this.basePath}/${viewModelName}`;

        ko.components.register(name, {
            viewModel: { require: viewModelPath },
            template: { require: viewPath }
        });

        console.info('Registering component: ' + name + ' (' + viewModelPath + '|' + viewPath + ')');

        return this;
    }

    private basePath: string;

    public kinds: string[] = [];
}

export = PluginRegistry;