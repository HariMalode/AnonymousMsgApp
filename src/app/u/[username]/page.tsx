'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useParams } from "next/navigation";
import * as z from "zod";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const schema = z.object({
    content: z.string().nonempty("Content is required")
});

type FormData = z.infer<typeof schema>;

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
};

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessages() {
    const { toast } = useToast();
    const params = useParams<{ username: string }>();
    const form = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const [suggestedMessages, setSuggestedMessages] = useState<string[]>(parseStringMessages(initialMessageString));
    const [loading, setLoading] = useState<boolean>(false);
    const [sendmsgloading, setSendmsgloading] = useState<boolean>(false);

    const fetchSuggestedMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/suggest-messages');
            if (response) {
                setSuggestedMessages(response.data.messages);
            }

            toast({
                title: 'New message suggested',
            });
        } catch (error) {
            console.error("Error fetching suggested messages", error);
            toast({
                title: 'Error while fetching messages',
                description: 'An unexpected error occurred. Please try again later'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestedMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setSendmsgloading(true);

        try {
            const response = await axios.post<ApiResponse>(`/api/send-message`, {
                username: params.username,
                content: data.content
            });
            form.setValue('content', "");

            toast({
                title: 'Success',
                description: response.data.message
            });

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: 'Error while sending message',
                description: axiosError.response?.data.message ?? 'An unexpected error occurred. Please try again later'
            });
        } finally {
            setSendmsgloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <nav className="bg-blue-600 text-white p-4">
                <h1 className="text-3xl font-bold">Anonymous Message</h1>
            </nav>
            <br />
            <div className="flex justify-center items-center flex-grow">
                <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Public Profile Link</h2>
                        <h3 className="text-xl font-medium">Send Anonymous Message to @{params.username}</h3>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="content"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="content">Your Message</FormLabel>
                                        <textarea
                                            {...field}
                                            id="content"
                                            placeholder="Type message here"
                                            className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none"
                                        />
                                    </FormItem>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <Button type="submit" className="w-full" disabled={!field.value || sendmsgloading}>
                                        {sendmsgloading ? 'Sending...' : 'Send Message'} 
                                    </Button>
                                )}
                            />
                        </form>
                    </Form>

                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">Suggested Messages</h4>
                            <Button onClick={fetchSuggestedMessages} disabled={loading}>
                                {loading ? 'Fetching...' : 'Fetch New Messages'}
                            </Button>
                        </div>
                        <br />
                        <div>( Click on any message below to select it.) </div>

                        <ul className="list-disc list-inside mt-2 space-y-2">
                            {suggestedMessages.map((msg, index) => (
                            <li
                                key={index}
                                className="cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300 p-2 rounded"
                                onClick={() => handleSuggestedMessageClick(msg)}
                            >
                            {msg}
                            </li>
                            ))}
                        </ul>

                    </div>
                </div>
            </div>

                <Separator className="my-3" />
                <div className="text-center">
                    <div className="mb-4">Get Your own Message Board</div>
                    <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                    </Link>
                </div>
        </div>
    );
}
