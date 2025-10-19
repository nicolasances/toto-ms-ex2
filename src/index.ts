import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config";
import { SayHello } from "./dlg/ExampleDelegate";

const api = new TotoAPIController("toto-ms-ex2", new ControllerConfig(), { basePath: '/ex2' });

api.path('POST', '/hello', new SayHello())

api.init().then(() => {
    api.listen()
});