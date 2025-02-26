import express, { Request, Response } from "express";
import * as database from "./user.database";
import { User, UnitUser } from "./user.interface";
import { StatusCodes } from "http-status-codes";

// Create a router
const userRouter = express.Router();

// GET all USERS
userRouter.get(
    "/users", async (req: Request, res: Response) => {
        try {
            const allUsers: UnitUser[] = await database.findAll();
            if (!allUsers) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: `no users found` });
            }
            res.status(StatusCodes.OK).json({ total_user: allUsers.length, allUsers });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// GET user by ID
userRouter.get(
    "/users/:id", async (req: Request, res: Response) => {
        try {
            const user: UnitUser | null = await database.findOne(req.params.id);
            if (!user) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: `user not found` });
            }
            res.status(StatusCodes.OK).json(user);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Register a new user
userRouter.post(
    "/register", async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body as User;
            if (!username || !email || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please provide all fields` });
            }
            const user: UnitUser | null = await database.findByEmail(email);
            if (user !== null) {
                res.status(StatusCodes.BAD_REQUEST).json({ msg: `User already exists` });
            }
            const newUser: UnitUser = await database.create({ username, email, password });
            res.status(StatusCodes.CREATED).json(newUser);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Login a user
userRouter.post(
    "/login", async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body as User;
            if (!email || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please provide all fields` });
            }
            const user: UnitUser | null = await database.findByEmail(email);
            if (!user) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: `User not found` });
            }
            const comparePassword: null | UnitUser = await database.comparePassword(email, password);
            if (!comparePassword) {
                res.status(StatusCodes.BAD_REQUEST).json({ msg: `Invalid credentials` });
            }
            res.status(StatusCodes.OK).json({ msg: `User logged in` });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Update a user
userRouter.put(
    "/users/:id", async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body as User;
            const getUser: UnitUser | null = await database.findOne(req.params.id);
            if (!username || !email || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please provide all fields` });
            }
            if (!getUser) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: `User not found` });
                return;
            }
            const updateUser: UnitUser | null = await database.update(req.params.id, { username, email, password });
            if (!updateUser) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: `User not updated` });
                return;
            }
            res.status(StatusCodes.OK).json(updateUser);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Delete a user
userRouter.delete(
    "/user/:id", async (req: Request, res: Response) => {
        try {
            const id = (req.params.id);
            const user = await database.findOne(id);
            if (!user) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: `User not found` });
            }
            await database.remove(id);
            res.status(StatusCodes.OK).json({ msg: `User deleted` });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    }
);

// Export the router
export default userRouter;