import { User, UnitUser, Users } from "./user.interface";
import bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import fs from "fs";

// Load the users from the file when the app starts
let users: Users = loadUsers();

// Function to load users from the JSON file
function loadUsers(): Users {
  try {
    const data = fs.readFileSync("./users.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    return {};
  }
}

// Function to save users back into the JSON file
function saveUsers(): void {
  try {
    fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
    console.log("Users saved successfully!");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

// This function fetches all users and returns a promise of an array of UnitUser objects
export const findAll = async (): Promise<UnitUser[]> => 
  Object.values(users); // Assuming users is an object of UnitUser objects

// This function fetches a specific user by ID and returns a promise of a UnitUser object
export const findOne = async (id: string): Promise<UnitUser> => 
  users[id]; // Access user by ID directly from users object

// This function creates a new user with provided user data 
export const create = async (userData: UnitUser): Promise<UnitUser | null> => {
  // Generate a unique random ID for the new user
  let id = random(); 

  // Check if the ID already exists in the users object
  let check_user = await findOne(id);

  // Ensure the generated ID is unique before proceeding
  while (check_user) { // Keep looping until a unique ID is found
    id = random(); // Generate a new random ID
    check_user = await findOne(id); // Check again for uniqueness
  }

  // Generate a salt for password hashing
  const salt = await bcrypt.genSalt(10); 
  // Hash the password using bcrypt with the generated salt
  const hashedPassword = await bcrypt.hash(userData.password, salt); 

  // Construct the new UnitUser object, including ID and hashed password
  const user: UnitUser = {
    id: id, // Assign the unique ID
    username: userData.username, // Assign username from input data
    email: userData.email, // Assign email from input data
    password: hashedPassword // Assign the hashed password
  };

  // Note: You would typically need to add the new user to the users object here or persist it to a database
  // For instance: 
  users[id] = user;
  saveUsers();
  return user; // Return the created user object
};

// Function to find a user by email
export const findByEmail = async (user_email: string): Promise<null | UnitUser> => {
  const allUsers = await findAll();
  const getUser = allUsers.find(result => user_email === result.email);

  if (!getUser) {
    return null;
  }
  
  return getUser;
};

// Function to compare the supplied password with the stored password
export const comparePassword = async (email: string, supplied_password: string): Promise<null | UnitUser> => {
  const user = await findByEmail(email);
  const decryptPassword = await bcrypt.compare(supplied_password, user!.password);

  if (!decryptPassword) {
    return null;
  }
  
  return user;
};

// Function to update a user's details
export const update = async (id: string, updateValues: User): Promise<UnitUser | null> => {
  const userExists = await findOne(id);
  
  if (!userExists) {
    return null;
  }
  
  if (updateValues.password) {
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(updateValues.password, salt);
    updateValues.password = newPass;
  }

  users[id] = {
    ...userExists,
    ...updateValues
  };

  saveUsers();
  return users[id];
};

// Exporting a function named 'remove' that takes an 'id' as a string parameter 
// and returns a Promise that resolves to null and does not return a value.
// The function is asynchronous, allowing the use of 'await' for asynchronous operations.
export const remove = async (id: string): Promise<null | void> => {
  // Await the result of a function 'findOne' using the provided 'id'
  // and assign the result to 'user'.
  const user = await findOne(id);

  // Check if 'user' does not exist (is falsy).
  if (!user) {
    // If 'user' is not found, return null, signaling that the operation was not successful.
    return null;
  }

  // Delete the user from the 'users' collection using the provided 'id' as the key.
  delete users[id];

  // Save the updated 'users' collection or state.
  saveUsers();
};
