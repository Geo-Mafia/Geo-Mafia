import { Reference, ListResult as IListResult } from "./storage";
export declare abstract class ListResult implements IListResult {
    items: Array<Reference>;
    prefixes: Array<Reference>;
    nextPageToken?: string;
    constructor(items: Array<Reference>, prefixes: Array<Reference>, nextPageToken?: string);
}
