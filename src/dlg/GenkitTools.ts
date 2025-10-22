import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext } from "toto-api-controller";
import { genkit, z } from 'genkit';
import { awsBedrock, anthropicClaude37SonnetV1} from "genkitx-aws-bedrock";

export class TestTools implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const modelId = "eu.anthropic.claude-3-7-sonnet-20250219-v1:0";

        const ai = genkit({
            plugins: [
                awsBedrock({ region: "eu-north-1" }),
            ],
            model: anthropicClaude37SonnetV1("eu"),
        });

        const getWeather = ai.defineTool(
            {
                name: 'getWeather',
                description: 'Gets the current weather in a given location',
                inputSchema: z.object({
                    location: z.string().describe('The location to get the current weather for'),
                }),
                outputSchema: z.string(),
            },
            async (input) => {
                console.log("Tool call ------------------");
                console.log(input);
                
                // Here, we would typically make an API call or database query. For this
                // example, we just return a fixed value.
                return `The current weather in ${input.location} is 63°F and sunny.`;
            },
        );

        const sumNumbers = ai.defineTool(
            {
                name: 'sumNumbers',
                description: 'Sums two numbers and returns the result',
                inputSchema: z.object({
                    a: z.number().describe('The first number'),
                    b: z.number().describe('The second number'),
                }),
                outputSchema: z.number(),
            },
            async (input) => {
                console.log("Tool call ------------------");
                console.log(input);
                
                // Here, we would typically make an API call or database query. For this
                // example, we just return a fixed value.
                return input.a + input.b;
            },
        );

        const response = await ai.generate({
            prompt: 'What is 2.55 + 3?',
            tools: [sumNumbers],
            output: {schema: z.object({ answer: z.number() })}
        });

        return {response: response.output}
        

    }

}