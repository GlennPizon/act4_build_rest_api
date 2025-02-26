import express, { Request, Response } from "express";
import { findAll, findOne, create, update, remove, loadUsers, saveUsers, comparePassword } from "./user.database"; 
import { UnitUser, User } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import { v4 as random } from "uuid";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await findAll();
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error retrieving users" });
  }
});

// GET user by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await findOne(id);
    if (user) {
      res.status(StatusCodes.OK).json(user);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error retrieving user" });
  }
});

// POST create a new user
router.post("/", async (req: Request, res: Response) => {
  const { username, email, password }: User = req.body;

  if (!username || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username, email, and password are required" });
  }

  try {
    const id = random();
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await loadUsers();

    if (Object.values(users).some(user => user.email === email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already in use" });
    }

    const newUser: UnitUser = { id, username, email, password: hashedPassword };
    users[id] = newUser;
    await saveUsers(users);

    return res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating user" });
  }
});

// PUT update user by ID
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Partial<User> = req.body;

  try {
    const users = await loadUsers();

    if (!users[id]) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    users[id] = { ...users[id], ...updateData };
    await saveUsers(users);

    res.status(StatusCodes.OK).json(users[id]);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error updating user" });
  }
});

// DELETE user by ID
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const success = await remove(id);
    if (success) {
      res.status(StatusCodes.NO_CONTENT).send();
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error deleting user" });
  }
});

// POST login user (authentication)
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email and password are required" });
  }

  try {
    const user = await comparePassword(email, password);
    if (user) {
      res.status(StatusCodes.OK).json({ message: "Login successful", user });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error during login" });
  }
});

export default router;
