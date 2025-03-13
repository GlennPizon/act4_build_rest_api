export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}


export interface UnitProduct extends Product {
  unit: string;
}

export interface Products {
  items: Product[];
}
