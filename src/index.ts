import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config";
import { SayHello } from "./dlg/ExampleDelegate";
import { PostPrompt } from "./dlg/BedrockTest";
import { PostLangchainPrompt } from "./dlg/LangchainTest";

const api = new TotoAPIController("toto-ms-ex2", new ControllerConfig(), { basePath: '/ex2' });

api.path('GET', '/lang/test', new PostLangchainPrompt(), { contentType: 'application/json', noAuth: true, ignoreBasePath: false})
api.path('GET', '/test', new PostPrompt(), { contentType: 'application/json', noAuth: true, ignoreBasePath: false})
api.path('POST', '/hello', new SayHello())

api.init().then(() => {
    api.listen()
});