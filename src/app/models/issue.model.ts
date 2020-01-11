export class Issue {

    constructor(
        public id: string = '',
        public descricao: string = '',
        public ponto: number | undefined,
        public acao: Array<string> = ['remover', 'abrir', 'votar'],
        public votada: boolean = false
    ) { }

}
