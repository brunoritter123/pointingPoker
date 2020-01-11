import { PoSelectOption } from "@portinari/portinari-ui";

export class Sprint implements PoSelectOption {

    constructor(
        public value: string | number,
        public label: string = ''
    ) { }

}
