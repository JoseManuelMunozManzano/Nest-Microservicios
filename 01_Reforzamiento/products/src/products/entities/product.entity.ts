interface UpdateWithOptions {
  name?: string;
  description?: string;
  price?: number;
}

// Una entidad es una representación de la BBDD (que no tiene por qué ser igual) que vamos a usar en nuestra app.
export class Product {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
  ) {}

  updateWith({ name, description, price }: UpdateWithOptions) {
    this.name = name ?? this.name;
    this.description = description ?? this.description;
    this.price = price ?? this.price;
  }
}
