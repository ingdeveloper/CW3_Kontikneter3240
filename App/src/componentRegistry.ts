class ComponentRegistry {
    constructor(basePath: string) {
        this.basePath = basePath;
        console.info('Setting component registry root: ' + basePath);

    }


    public mapComponent(name: string, viewName?: string, viewModelName?: string): ComponentRegistry {
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
}

export = ComponentRegistry;