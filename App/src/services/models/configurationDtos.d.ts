interface ControlConfigurationDTO extends DTO {
    UserId: string,
    Name: string,
    Namespace: string,
    Owner: string,
    CreatedOn: DateTime,
    Content: string,
    ControlType: number,
    Version: number
}