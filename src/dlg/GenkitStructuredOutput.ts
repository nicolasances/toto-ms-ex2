import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext } from "toto-api-controller";
import { genkit, z } from 'genkit';
import { awsBedrock, anthropicClaude37SonnetV1 } from "genkitx-aws-bedrock";

export class TestGenkitStructuredOutput implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const modelId = "eu.anthropic.claude-3-7-sonnet-20250219-v1:0";

        const ai = genkit({
            plugins: [
                awsBedrock({ region: "eu-north-1" }),
            ],
            model: anthropicClaude37SonnetV1("eu"),
        });

        const MenuItemSchema = z.object({
            name: z.string().describe('The name of the menu item.'),
            description: z.string().describe('A description of the menu item.'),
            calories: z.number().describe('The estimated number of calories.'),
            allergens: z.array(z.string()).describe('Any known allergens in the menu item.'),
        });

        const response = await ai.generate({
            prompt: 'Suggest a menu item for a pirate-themed restaurant.',
            output: { schema: MenuItemSchema },
        });

        return { response: response.output }
    }

}