import Router from "@koa/router";
import { general } from "./controller";
import {order} from './controller'

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get("/", general.helloWorld);

// order route
unprotectedRouter.get("/orders", order.getOrders);
unprotectedRouter.get("/orders/:uid", order.getOrder);
unprotectedRouter.post("/orders", order.createOrder);
unprotectedRouter.put("/orders/:uid", order.updateOrder);

export { unprotectedRouter };