import { error } from "console";
import { connect } from "http2";
import mongoose from "mongoose";

type ConnectionObject={
    isConnected ?: number;
}

const connection : ConnectionObject ={};

async function dbConnect(): Promise<void>{
    //check we have connection already or not
    if(connection.isConnected){
        console.log("Already connected to DB");
        return;
    }

    try{
        //connecting to db
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        
        connection.isConnected = db.connections[0].readyState;

        console.log("Connected to DB");
    }catch(error){
        console.error("Database connection failed:", error);  
        process.exit(1);

    }
}

export default dbConnect;