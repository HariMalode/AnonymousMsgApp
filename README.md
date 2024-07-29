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

 ---


 LEct 5: Signup user and custom OTP in NextJS

 complete route.ts in api/signUp



 ----

 lect 6 : Crash course on Next Auth or Authjs
 https://next-auth.js.org/
 NextAuth.js is becoming Auth.js! 

 So : https://authjs.dev/?_gl=1*1ssrx9w*_gcl_au*NDM3OTQyNjc1LjE3MjE3OTU5MjA.
 npm install next-auth@beta
 npm install next-auth

 create /app/api/auth/[...nextauth]/route.ts and option.ts


complete option.ts and route.ts in nextauth folder

 create next-auth.d.ts in types, here we have updated the interface of user, session , jwt
 so that we can match it in route.ts in [nextauth]
 

 complete middleware.ts in src

 create (auth)/sign-in/page.ts in src/app

 create context/AuthProvider.tsx
 wrap body in layout in <AuthProvider>


 ----
 lect 7 : unique username check in nextjs

 npm install @react-email/components
 create check-username-unique/route.ts in api and complete it and check using postman

 create verify-code/route.ts in api
 complete it


 ---

 Lect 8: Message API with aggregation pipeline

 create accept-messages/route.ts in api
 create get-messages/route.ts in api

 aggregation pipeline: ye sorting and all krke op deta useful where large data need to access

 create send-message/route.ts in api

 ---

 LECT 9 : Integrating AI features in NextJS project

 goto: https://sdk.vercel.ai/docs/introduction

 npm install ai @ai-sdk/openai zod, npm i ai openai
 create suggest-messages/route.ts in api

---

Lect 10 : React hook form, shadcn and debouncing

Backend almost complete, Backend-> api folder all files
now starting frontend, isme frontend and back ek sat hi rahta

Using Shadcn now, WHAT IS SHADCN?
shadcn is a library provides readymade component

https://ui.shadcn.com/docs/components/pagination

run npx shadcn-ui@latest init
ye lib folder already h ume utils.ts and other files krke init krta

explain react hook form.

multiple input field ho to prefer react hook form
form k har field ko lag state me manage krna hota h
 react provides featues to manage all state in one object, har field k liye alg state nahi

 add form in our project
npx shadcn-ui@latest add form
it creates components/ui folder for tsx files

npm i axios to send req

now https://usehooks-ts.com/introduction
npm install usehooks-ts

usehooks debounce k liye, jb backend s data bar bar fetch krna ho to check username, kuch to gap rkte sec ka, in input field change hone p nahi , kuch delay k bad dta fetch

npx shadcn-ui@latest add toast
// toaster is a component which is used to show message to user
Add the Toaster component in app/layout.tsx , body k andar insert kro

jaha use krna vah const { toast } = useToast() ye kro

npx shadcn-ui@latest add input


create src/app/(auth)/sign-up/page.tsx
route->backend(ts)
page->frontend(tsx)


-----

Lect 11: OTP verification in NextJS

create src/app/(auth)/verify/[username]/page.tsx

as we are taking http://localhost:3000/?username=hari_malode as a link 
so it is dynamic, need to create [] folder in src/app/(auth)/verify/


---

lect 12: Handling signin with AuthJS

create src/app/(auth)/sign-in/page.tsx
complete it and check user able to sign in or not
backend for this src/app/api/auth/[...nextauth]/options.ts

 create src/app/(app)/dashboard/page.tsx

 delete .next folder, ye caching folder h
 now move layout and page in src/app/(app)


 layout is main page, vo dashoboard me ab sue kr skte


