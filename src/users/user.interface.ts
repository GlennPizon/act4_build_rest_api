export interface User {
    id: string;        // Unique identifier for the user
    username: string;  // Username of the user
    email: string;     // Email of the user
    password: string;  // Hashed password of the user
  }

  
  export interface UnitUser extends User {
    id: string; // The unique identifier for each user
  }
  
  export interface Users {
    [key: string]: UnitUser; // The collection of users, where each key is a string (user ID)
  }
  