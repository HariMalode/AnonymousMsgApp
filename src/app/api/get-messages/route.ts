import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/options";


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session ||!user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    const userId =  new mongoose.Types.ObjectId(user._id);
    //return obj , new way

    try{
        const myUser = await UserModel.findById(userId);
        const user = await UserModel.aggregate([
            //aggregation pipeline
            { $match : { _id : userId } },
            { $unwind : "$messages" },
            { $sort : { "messages.createdAt" : -1 } },
            { $group : {
                _id : "$_id",
                messages : { $push : "$messages" }
            } }
        ]).exec();
        // console.log("Myuser:",myUser)
        // console.log("user:",user)

        // if(!user || user.length === 0){
        //     return Response.json(
        //         { success: false, message: "User not found" },
        //         { status: 404 }
        //     );
        // }
        if(!myUser){
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json(
            // {messages: user[0].messages},
            {messages: myUser.messages},
            { status: 200 }
        );
    } catch (error) {
        console.error(" Error while get Messages", error);
        return Response.json(
            { success: false, message: "Error finding user" },
            { status: 500 }
        );
    }

}
