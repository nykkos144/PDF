import OptionInterface from "./option.interface";

export default interface ToolInterface {
    id : string,
    name : string,
    image : string,
    description : string,
    allowedFiles : string,
    color : string,
    route : {
        type : 'route' | 'open',
        component : string
    } | null,
    options : OptionInterface [] | null
}