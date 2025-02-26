import { User, UnitUser, Users } from "./user.interface"
import bcrypt from "bcryptjs"
import { v4 as random } from "uuid"
import fs from "fs"

let users: Users = loadUsers();

function loadUsers(): Users {
  try{
      const data = fs.readFileSync("src/users/users.json", "utf-8")
      return JSON.parse(data);
  }
  catch(error){
      console.log(error);
      return {};
  }
}





function saveUsers () {
  try{
      fs.writeFileSync("./users.json", JSON.stringify(users),"utf-8")
  }
  catch(error){
      console.log(error);
  }
}


export const findAll = async(): Promise<UnitUser[]> => {
  return Object.values(users);
}

const findOne = async(id: string): Promise<UnitUser | null> => {
  const user = users[id];
  if(user){
      return user;
  }
  return null;
}

export const create = async(userData: User): Promise<UnitUser | null>  => {
  let id = random ();
  let check_user = users[id];
  while(check_user){
    id = random();
    check_user = users[id];

  }
  const salt = await bcrypt.genSalt(10);
  const hashedPasword = await bcrypt.hash(userData.password, salt);

  const user: UnitUser = {
    id: id,
    username: userData.username,
    email: userData.email,
    password: hashedPasword

  }
  

  users[id] = user;
  saveUsers();
  return user;


}
export const findByEmail = async(email: string): Promise<UnitUser | null> => {
  const allUsers = await findAll();
  const getUser = allUsers.find(user => user.email === email);
  if(getUser){  
      return getUser;
  }   

  return null;
}

