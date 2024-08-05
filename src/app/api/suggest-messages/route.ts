// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const response = await openai.completions.create({
//       model: 'gpt-3.5-turbo-instruct',
//       max_tokens: 400,
//       stream: true,
//       prompt,
//     });

//     const stream = OpenAIStream(response);
    
    
//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       // OpenAI API error handling
//       const { name, status, headers, message } = error;
//       return NextResponse.json({ name, status, headers, message }, { status });
//     } else {
//       // General error handling
//       console.error('An unexpected error occurred:', error);
//       throw error;
//     }
//   }
// }






import { NextResponse } from 'next/server';
import questions from './questions.json';

export async function GET(request: Request) {
    try {
        const questionsPerPage = 3;
        const totalQuestions = questions.sampleQuestions.length;
        let messages = [];

        // Create a copy of the questions array to shuffle
        const shuffledQuestions = [...questions.sampleQuestions];

        // Shuffle the array
        for (let i = totalQuestions - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }

        // Take the first 'questionsPerPage' questions from the shuffled array
        messages = shuffledQuestions.slice(0, questionsPerPage);

        return NextResponse.json(
            { messages: messages },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while getting messages", error);
        return NextResponse.json(
            { success: false, message: "Error retrieving messages" },
            { status: 500 }
        );
    }
}
