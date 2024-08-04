'use client';

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { Form } from "@/components/ui/form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast";
import {useRouter} from "next/navigation"
import axios, { AxiosError} from "axios"
import { signInSchema } from "@/schemas/signInSchema";
import { FormControl, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form";
import {Input} from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function SignInForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver : zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    })
    



    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username: data.identifier,
                password: data.password,
            });

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    toast({
                        title: "Error! Sign In Failed",
                        description: "Invalid username or password",
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: result?.error ?? "An error occurred",
                        variant: 'destructive',
                    });
                }
            }

            if (result?.url) {
                router.replace('/dash');
            }

        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                toast({
                    title: 'Error',
                    description: error.response?.data?.message ?? "An error occurred",
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Error',
                    description: (error as Error).message ?? "An error occurred",
                    variant: 'destructive',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
            
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-6">
                Welcome to Anonymous Adventure
                </h1>
                
                <p className="mb-4 font-bold">
                Sign In to start your anonymous adventure
                </p>

            </div>

            < Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    name="identifier"
                    control= {form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Email / Username</FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="Username or Email"
                                    {...field}
                                />
                            </FormControl>

                            
                            <FormMessage/>

                        </FormItem>
                    )}
                    />

                   

                    <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </Button>                    


                </form>
            </Form>

            <div className="text-center">
                
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">
                    Sign Up
                    </Link>
                </p>

            </div>

            </div>
        </div>
    )
}
