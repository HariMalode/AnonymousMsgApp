import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try{
        const user = await UserModel.findOne({ username });
        if(!user){
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        //check is user accepting msg
        if(!user.isAcceptingMessage){
            return Response.json(
                { success: false, message: "User is not accepting messages" },
                { status: 403 } //forbidden
            );
        }

        const newMessage  = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();
        //PUSHING IN ARR OF MSG
        
        return Response.json(
            {
                success: true,
                message: "Message sent",
            },
            { status: 200 }
        );
    }catch(error){
        console.error("Error sending message:", error);
        return Response.json(
            { success: false, message: "Error sending message" },
            { status: 500 }
        );
    }


}