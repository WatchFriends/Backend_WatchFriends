import { Series } from "./Series";

export class List {
    constructor(
        public name: string,
        public series: Series[],
        public apiRequest: string,
        public page: number,
        public totalPages: number
    ){}
}