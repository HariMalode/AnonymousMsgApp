import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { User } from 'next-auth'
import { Message } from '@/model/User'
import { NextResponse } from "next/server";
import { authOptions } from '../../auth/[...nextauth]/options';


export async function DELETE(request: Request, { params }: { params: { msgID: string } }) {
    const msgID = params.msgID;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    
    if(!user || !session){
        return NextResponse.json({
            message: "You are not logged in",
            success: false
        }, {status: 401});
    }

    try{
        const updatedResult = await UserModel.updateOne({
            username: user.username
        }, {
            $pull: {
                messages: {
                    _id: msgID
                }
            }
        });
    

    if(updatedResult.modifiedCount === 0){
        return NextResponse.json({
            message: "Message not found",
            success: false
        }, {status: 404});
    }

    return NextResponse.json({
        message: "Message deleted successfully",
        success: true
    }, {status: 200});
   
    }catch(error){
        console.log(error);
        return NextResponse.json({
            message: "Error while deleting Message || Internal Server Error",
            success: false
        }, {status: 500});
    }

}