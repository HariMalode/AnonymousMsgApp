import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

// POST for updating status and GET for retrieving status

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // to get info abt logged user

  const user: User = session?.user; //optionally

  // console.log("USER:", user)
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  // console.log("userId:",userId)
  // console.log("acceptMessages:",acceptMessages)

  try {
    // Updating Users Msg acceptance status

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    console.log("updatedUser:", updatedUser)

    if (!updatedUser) {
      //User Not found
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Messages acceptance status updated",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error updating message acceptance status" },
      { status: 500 }
    );
  }
}



export async function GET(request: Request) {
    await dbConnect();

    // Get User Session
    const session = await getServerSession(authOptions);
    // to get info abt logged user
    const user: User = session?.user; 

    if (!session || !user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    try{
        const foundUser = await UserModel.findById(user._id);

        if(!foundUser){
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User found",
                isAcceptingMessages: foundUser.isAcceptingMessage,
            },
            { status: 200 }
        );
    }catch(error){
        console.error(" Error while retrieving message acceptance status:", error);
        return Response.json(
            { success: false, message: "Error finding user" },
            { status: 500 }
        );
    }

}
