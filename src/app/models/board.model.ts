import { PoSelectOption } from "@portinari/portinari-ui";

export class Board implements PoSelectOption {

    constructor(
        public value: string | number,
        public label: string = ''
    ) { }

}
