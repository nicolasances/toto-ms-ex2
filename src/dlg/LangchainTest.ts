import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext } from "toto-api-controller";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export class PostLangchainPrompt implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const modelId = "eu.anthropic.claude-3-7-sonnet-20250219-v1:0";

        const llm = new BedrockChat({
            model: modelId,
            // It's still a good practice to set the region explicitly
            region: "eu-north-1",
            // OMITTING the 'credentials' object allows the SDK to use the IAM Task Role!
            temperature: 0.1,
            streaming: false,
        });

        const classificationSchema = z.object({
            sentiment: z.string().describe("The sentiment of the text"),
            aggressiveness: z
                .number()
                .int()
                .describe("How aggressive the text is on a scale from 1 to 10"),
            language: z.string().describe("The language the text is written in"),
        });

        const parser = StructuredOutputParser.fromZodSchema(classificationSchema);

        const formatInstructions = parser.getFormatInstructions();

        const taggingPrompt = ChatPromptTemplate.fromTemplate(`
            Extract the desired information from the following passage.

            Only extract the properties mentioned in the 'Classification' function.

            Follow the format instructions carefully.

            Format instructions:
            {format_instructions}

            Passage:
            {input}
            `);

        const chain = taggingPrompt.pipe(llm).pipe(parser);

        const response = await chain.invoke({
            input: "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!",
            format_instructions: formatInstructions,
        });

        console.log(response);

        return response;

    }

}