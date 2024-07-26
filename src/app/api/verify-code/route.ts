import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try{
    const { username, code} = await request.json();
    const decodedUsername = decodeURIComponent(username);
    // to remove URL symbols make it clear

    const user = await UserModel.findOne({username: decodedUsername});

    if(!user){
      return Response.json({
        success: false,
        message: "User not found"
      }, {
        status: 404
      })
    }


    // check is code correct and not expired

    const isCodeCorrect = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeCorrect && isCodeNotExpired){
      user.isVerified = true;
      await user.save();

      return Response.json({
        success: true,
        message: "User verified"
      }, {
        status: 200
      });
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Code expired. Please sign in again to get a new code"
      }, {
        status: 400
      });
    } else {  // code incorrect
      return Response.json({
        success: false,
        message: "Code incorrect"
      }, {
        status: 400
      });
    }
}catch(error){
  console.log("Error while verifying user:", error);
  return Response.json({
    success: false,
    message: "Error while verifying user code | Internal Server Error"
  }, {
    status: 500
  })
}
}