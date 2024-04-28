// Una entidad es una representación de la BBDD (que no tiene por qué ser igual) que vamos a usar en nuestra app.
export class Product {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
  ) {}

  // TODO: updateWith
}
