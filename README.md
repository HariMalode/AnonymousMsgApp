Steps: Lect2
npx create-next-app@latest
npm i
npm run dev


ahr chez ka modelling hona jaruri hai to. src/model/User.js craete kro
npm i mongoose

regexr pe validation ke statement hote h, jaise ki email validation

complete usermodel

foreach ($file in "signUpSchema.ts", "verifySchema.ts", "signInSchema.ts", "acceptMessageSchema.ts", "messageSchema.ts") {
    New-Item -Path . -Name $file -ItemType "File"
}
creates five file of schmea in schema folder


npm i zod and copmlete that five ts files


----


Lect3 : How to connect db


- NextJs is edgetime framework h, pura time continue nahi chlti , jese jese user ki req ati h vese vese cheeze execute hoti hai  , all time runnung nai as per demand
isme  database already conn h kya vo dekoagr h to use kro nahito firse conn 
-  create lib/dbConnect.ts in src



---

Lect 4 : Setup Resend email with NextJS
( Resend email : technology)
code should effectively handles both scenarios of registering a new user and updating an existing but unverified user account with a new password and verification code

https://resend.com/
docs: https://resend.com/docs/introduction
 
 steps: npm install resend

 create resend.ts in lib
 craete helpers/sendVerificationEmail.ts

 create emails/VerificationEmail.tsx
 npm i react-email
 docs : https://react.email/docs/getting-started/manual-setup

 create types/ApiResponse.ts

 complete sendVerificationEmail function

 now create api/signUp/route.
 
 npm i bcryptjs
 npm i --save-dev @types/bcryptjs

