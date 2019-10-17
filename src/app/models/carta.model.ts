export class Carta {

  constructor(
    public id: number = 0,
    public value: number | undefined,
    public label: string = '',
    public type: string = '',
    public nmUltHist: string = ''
  ) {}

}
