import { Product, UnitProduct, Products } from "./product.interface";
import { v4 as random } from "uuid";
import fs from "fs";

let products: { [key: string]: UnitProduct } = loadProducts();

function loadProducts(): { [key: string]: UnitProduct } {
  try {
    const data = fs.readFileSync("src/products/products.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error loading products:", error);
    return {};
  }
}

function saveProducts() {
  try {
    fs.writeFileSync("src/products/products.json", JSON.stringify(products), "utf-8");
  } catch (error) {
    console.log("Error saving products:", error);
  }
}

export const findAll = async (): Promise<UnitProduct[]> => {
  return Object.values(products);
};

export const findOne = async (id: string): Promise<UnitProduct | null> => {
  const product = products[id];
  if (product) {
    return product;
  }
  return null;
};

export const create = async (productData: Product): Promise<UnitProduct> => {
  let id = random();
  let check_product = products[id];
  while (check_product) {
    id = random();
    check_product = products[id];
  }

  
  const product: UnitProduct = {
    id: Number(id),
    name: productData.name,
    price: productData.price,
    description: productData.description,
    imageUrl: productData.imageUrl,
    unit: productData.name // Defaulting to name for demonstration
  };

  products[id] = product;
  saveProducts();
  return product;
};


export const update = async (id: string, updatedValues: Product): Promise<UnitProduct | null> => {
  const productExists = await findOne(id);
  if (!productExists) {
    return null;
  }

  products[id] = {
    ...productExists,
    ...updatedValues,
    id: Number(id)
  };

  saveProducts();
  return products[id];
};

export const remove = async (id: string): Promise<null | void> => {
  const product = await findOne(id);

  if (!product) {
    return null;
  }

  delete products[id];
  saveProducts();
  return;
};
