import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { version } from "node:os";
import {
  Product,
  products,
  ErrorResponse,
  isCreateProductBody,
  isCategoryProduct,
  OrderLine,
} from "../src/modules/product.js";
import { stringify } from "node:querystring";

/* Para que se usa el dotenv 
   El dotenv se usa para cargar variables de entorno desde un archivo .env en la aplicación.
   Esto permite mantener las configuraciones sensibles fuera del código fuente y facilita la gestión de diferentes entornos (desarrollo, producción, etc.).
*/
/* keep the env variables in the application */
const vars = dotenv.config();
const app = express();
app.use(express.json());

if (!vars.parsed || !vars.parsed.PORT) {
  console.error("Error: PORT variable is not defined in the .env file.");
  process.exit(1);
}

const PORT = vars.parsed.PORT;

app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "backend-api",
    version: "1.0.0",
    endpoints: {
      "/health": "Endpoint que da el estado del servicio",
      "/api/products": "Endpoint que ofrece una lista de productos",
      "/api/products/:id":
        "Endpoint que da informacion de un producto en especifico",
    },
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "backend-api",
  });
});

app.get("/api/products", (req: Request, res: Response) => {
  res.json(products);
});

app.get("/api/products/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id == id);
  product
    ? res.json(product)
    : res.status(404).json({ error: "Producto no encontrado" });
});

/* post implementations: */

app.post(
  "/api/create/product",
  (
    req: Request<{}, Product | ErrorResponse, unknown>,
    res: Response<Product | ErrorResponse>,
  ) => {
    /* Validate: if pass, Typescript known that req.body is CreateProductBody*/

    if (!isCreateProductBody(req.body)) {
      res.status(400).json({
        error: "Se requiere name (texto no vacío) y price (número positivo)",
      });
      return;
    }

    /* read the data by the client was sent*/
    const { name, price, category } = req.body;

    /* create the new product with his new id */
    const newid =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: newid,
      name: name.trim(),
      price,
      category,
    };
    console.log("Body recibido:", req.body);
    products.push(newProduct);

    res.status(201).json(newProduct);
  },
);

app.post("/api/orders", (req, res) => {
  const { items } = req.body;

  // ¿Llegó una lista con al menos un elemento?
  if (!Array.isArray(items) || items.length === 0) {
    res
      .status(400)
      .json({ error: "items debe ser una lista con al menos un producto" });
    return;
  }

  const lines: OrderLine[] = [];

  // Repetir lo mismo del Pedacito 4, una vez por cada item
  for (const item of items) {
    const productId = item?.productId;
    const quantity = item?.quantity;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      res
        .status(400)
        .json({ error: "Cada quantity debe ser un entero mayor que 0" });
      return;
    }

    const product = products.find((p) => p.id === productId);

    if (!product) {
      res
        .status(404)
        .json({ error: `El producto con id ${productId} no existe` });
      return;
    }

    lines.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity,
      subtotal: product.price * quantity,
    });
  }

  res.json({ lineas: lines });
});

app.listen(PORT, () => {
  console.log(`Api is listening on ${PORT} port`);
});
