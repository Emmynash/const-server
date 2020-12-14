import Router from "@koa/router";
import { general } from "./controller";
import { order } from './controller'

const unprotectedRouter = new Router();

// order route
unprotectedRouter.get("/orders", order.getOrders);
unprotectedRouter.get("/orders/:uid", order.getOrder);
unprotectedRouter.post("/orders", order.createOrder);
unprotectedRouter.put("/orders/:uid", order.updateOrder);

// Hello World route
unprotectedRouter.get("/", general.helloWorld);



export { unprotectedRouter };