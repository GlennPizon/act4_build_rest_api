import { User, UnitUser, Users } from "./user.interface"
import bcrypt, { compare } from "bcryptjs"
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

export const findOne = async(id: string): Promise<UnitUser | null> => {
  const user = users[id];
  if(user){
      return user;
  }
  return null;
}

export const create = async(userData: User): Promise<UnitUser>  => {
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
export const findByEmail = async(user_email: string): Promise<UnitUser | null> => {
  const allUsers = await findAll();
  const getUser = allUsers.find(user => user.email === user_email);
  if(getUser){  
      return getUser;
  }   

  return null;
}


export const comparePassword = async(email: string, suppliedPassword: string): Promise<null | UnitUser> => {
    const user = await findByEmail(email);
    const decryptedPassword = await bcrypt.compare(suppliedPassword, user!.password);
    if(decryptedPassword){
        return user;
    }

    return null;

}


export const update = async(id: string, updatedValues: User): Promise<UnitUser | null> => {

    const userExists = await findOne(id);
    if(!userExists){
        return null;
    }

    if(updatedValues.password){
        const salt = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(updatedValues.password, salt)
        updatedValues.password = newPass; 

    }

    users[id] = {
        ...userExists,
        ...updatedValues
    }

    saveUsers();
    return users[id];
}


export const remove = async(id: string) : Promise <null | void> => {
    const user = await findOne(id);

    if(!user){
        return null;

    }

    delete users[id];
    saveUsers();
    return;
}
