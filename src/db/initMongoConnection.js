import mongoose from "mongoose";


import { getEnvVar } from "../utils/getEnvVar";



function initMongoConnection() {
    return mongoose.connect(getEnvVar('MONGODB_URL'))
    .then(() => {
      console.log("Mongo connection successfully established!");
    })
    .catch((error) => {
        console.error("Error connecting to Mongo:", error);
        throw error
    }); 
    
}
export { initMongoConnection }
 
//z