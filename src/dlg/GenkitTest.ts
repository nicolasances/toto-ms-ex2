import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext } from "toto-api-controller";
import { genkit, z } from 'genkit';
import { awsBedrock, anthropicClaude37SonnetV1 } from "genkitx-aws-bedrock";

export class TestTools implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const modelId = "eu.anthropic.claude-3-7-sonnet-20250219-v1:0";

        const ai = genkit({
            plugins: [
                awsBedrock({ region: "eu-north-1" }),
            ],
            model: anthropicClaude37SonnetV1("eu"),
        });

        const response = await ai.generate("Explain the theory of relativity in simple terms.");

        return {response: response.text}
    }

}