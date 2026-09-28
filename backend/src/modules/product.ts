export interface Product {
  readonly id: number;
  name: string;
  price: number;
  category: CategoryProduct;
  description?: string;
}

/* respons when a product was created */
//return a product
export type CreateProductBody = Omit<Product, "id">;
//or return an error
export interface ErrorResponse {
  error: string;
}
/* ******************************************** */
export const CATEGORIES = ["fresh", "processed", "organic"] as const;
export type CategoryProduct = (typeof CATEGORIES)[number];

export var products: Product[] = [
  { id: 1, name: "Laptop", price: 3500000, category: "fresh" },
  { id: 2, name: "Mouse", price: 80000, category: "processed" },
  { id: 3, name: "Teclado", price: 150000, category: "processed" },
];

/* functionalities that could be implemented by product's endpoints */

export function isCreateProductBody(body: unknown): body is CreateProductBody {
  if (typeof body !== "object" || body === null) return false;

  const b = body as Record<string, unknown>;

  return (
    typeof b.name === "string" &&
    b.name.trim() !== "" &&
    typeof b.price === "number" &&
    b.price >= 0 && 
    isCategoryProduct(b.category) &&
    (b.description === undefined || typeof b.description === "string")
  );
}

// Revisa en ejecución que un valor sea una categoría válida
export function isCategoryProduct(value: unknown): value is CategoryProduct {
  return (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  );
}
