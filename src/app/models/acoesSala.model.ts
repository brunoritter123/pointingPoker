export class AcoesSala {
    constructor(
      public label : string,
      public value : string
    ) { }

    static getOpcoes(): Array<AcoesSala> {
        let opcoes: Array<AcoesSala> = [
            new AcoesSala('Ambos', '3' ),
            new AcoesSala('Administrador', '1' ),
            new AcoesSala('Jogador', '2' )
          ];

        return opcoes;
    }

    static findOpcao(value): AcoesSala {
        const acoesSala = AcoesSala.getOpcoes();
        let opcao;
        acoesSala.forEach( op => {
            if (op.value == value) {
                opcao = op;
            };
        });

        return opcao;
    }

    static getDefRemoveAdm() : AcoesSala {
        return new AcoesSala('Ambos', '3');
    }

    static getDefRemoveJogador() : AcoesSala {
        return new AcoesSala('Administrador', '1');
    }

    static getDefFinalizar() : AcoesSala {
        return new AcoesSala('Administrador', '1');
    }

    static getDefResetar() : AcoesSala {
        return new AcoesSala('Administrador', '1');
    }
  
  }