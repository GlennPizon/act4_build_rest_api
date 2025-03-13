import express, { Request, Response } from "express";
import * as productDatabase from "./product.database";
import { Product, UnitProduct } from "./product.interface";
import { StatusCodes } from "http-status-codes";

const productRouter = express.Router();

// GET all products
productRouter.get(
    "/products", async (req: Request, res: Response) => {
        try {
            const allProducts: UnitProduct[] = await productDatabase.findAll();
            if (!allProducts) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: "No products found" });
                return;
            }
            res.status(StatusCodes.OK).json({ total_products: allProducts.length, allProducts });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// GET product by ID
productRouter.get(
    "/products/:id", async (req: Request, res: Response) => {
        try {
            const product: UnitProduct | null = await productDatabase.findOne(req.params.id);
            if (!product) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: "Product not found" });
                return;
            }
            res.status(StatusCodes.OK).json(product);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Create a new product
productRouter.post(
    "/products", async (req: Request, res: Response) => {
        try {
            const { name, price, description, imageUrl } = req.body as Product;
            if (!name || !price || !description || !imageUrl) {
                res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all fields" });
                return;
            }
           
            const newProduct: UnitProduct = await productDatabase.create(req.body);
            res.status(StatusCodes.CREATED).json(newProduct);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Update a product
productRouter.put(
    "/products/:id", async (req: Request, res: Response) => {
        try {
            const { name, price, description, imageUrl } = req.body as Product;
          
            const getProduct: UnitProduct | null = await productDatabase.findOne(req.params.id);
            if (!name || !price || !description || !imageUrl) {
                res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all fields" });
                return;
            }
            
            if (!getProduct) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: "Product not found" });
                return;
            }
            const updatedProduct: UnitProduct | null = await productDatabase.update(req.params.id, req.body);
            if (!updatedProduct) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Product not updated" });
                return;
            }
            res.status(StatusCodes.OK).json(updatedProduct);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Delete a product
productRouter.delete(
    "/products/:id", async (req: Request, res: Response) => {
        try {
            const id = (req.params.id);
            const product = await productDatabase.findOne(id);
            if (!product) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: "Product not found" });
                return;
            }
            await productDatabase.remove(id);
            res.status(StatusCodes.OK).json({ msg: "Product deleted" });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

export default productRouter;
