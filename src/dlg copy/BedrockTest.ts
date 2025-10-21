import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext } from "toto-api-controller";

export class PostPrompt implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const modelId = "eu.anthropic.claude-3-7-sonnet-20250219-v1:0";
        const prompt = "Explain the concept of quantum entanglement.";

        const client = new BedrockRuntimeClient({});

        const claudeRequestBody = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 200,
            messages: [
                {
                    role: "user",
                    content: [{ type: "text", text: prompt }],
                },
            ],
        };

        const command = new InvokeModelCommand({
            contentType: "application/json",
            body: JSON.stringify(claudeRequestBody),
            modelId: modelId,
        });

        try {
            const response = await client.send(command);

            // Bedrock response body is a Uint8Array, so we need to decode it.
            const decodedResponseBody = new TextDecoder().decode(response.body);
            const responseBody = JSON.parse(decodedResponseBody);

            // Extract the text response from the Claude-specific structure
            const llmResponseText = responseBody.content[0].text;

            console.log("--- LLM Response ---");
            console.log(llmResponseText);
            console.log("--------------------");
            
            return { message: "Hello from EX2!", runningOn: process.env.GCP_PID ? 'GCP' : "AWS", response: llmResponseText}

        } catch (error) {
            console.error("Error invoking Bedrock model:", error);
            // Be sure to check your IAM permissions, model access, and region.
        }

        return {message: "Ex2 works, but not this endpoint"}
    }

}