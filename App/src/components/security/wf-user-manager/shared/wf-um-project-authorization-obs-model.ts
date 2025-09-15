declare var uuid;

class ProjectAuthorizationObs {
    ID: KnockoutObservable<string>;
    Name: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    Version: KnockoutObservable<number>;
    
    constructor() {
        this.ID = ko.observable(null);
        this.Name = ko.observable(null);
        this.Name.extend({ required: '' }) // field is required
        this.Description = ko.observable(null);
        this.Version = ko.observable(0);
    }

    initialize() {
        this.ID(uuid.v4()); // set new id
        this.Name(null);
        this.Description(null);
        this.Version(0);
    }

    toDto() {
        let projectAuthorizationDto: ProjectAuthorizationDTO = {
            ID: this.ID(),
            Name: this.Name(),           
            Description: this.Description(),
            Version: this.Version(),
        }

        return projectAuthorizationDto;
    }

    fromDto(projectAuthorization: ProjectAuthorizationDTO) {
        this.ID(projectAuthorization.ID);
        this.Name(projectAuthorization.Name);
        this.Description(projectAuthorization.Description);
        this.Version(projectAuthorization.Version);
    }
}

export = ProjectAuthorizationObs;