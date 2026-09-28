import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { version } from "node:os";
import { Product } from "../src/modules/product.js";

/* Para que se usa el dotenv 
   El dotenv se usa para cargar variables de entorno desde un archivo .env en la aplicación.
   Esto permite mantener las configuraciones sensibles fuera del código fuente y facilita la gestión de diferentes entornos (desarrollo, producción, etc.).
*/
/* keep the env variables in the application */
const vars = dotenv.config();
const app = express();

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

const products = [
  { id: 1, name: "Laptop", price: 3500000 },
  { id: 2, name: "Mouse", price: 80000 },
  { id: 3, name: "Teclado", price: 150000 },
];

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

app.

/* app.get("/api/products/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(product);
}); */

app.listen(PORT, () => {
  console.log(`Api is listening on ${PORT} port`);
});
