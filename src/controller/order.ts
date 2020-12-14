import { BaseContext } from "koa";
import { getManager, Repository, Not, Equal, Like } from "typeorm";
import { validate, ValidationError } from "class-validator";
import { request, summary, path, body, responsesAll, tagsAll } from "koa-swagger-decorator";
import { orderSchema, updateOrderSchema } from '../entity/order'
import admin from '../firebase-admin'

@responsesAll({ 200: { description: "success"}, 400: { description: "bad request"}, 401: { description: "unauthorized, missing/wrong jwt token"}})
@tagsAll(["Order"])
export default class OrderController {

    @request("get", "/orders")
    @summary("Find all orders")
    public static async getOrders(ctx: BaseContext): Promise<void> {

        // get database reference for order
        const db = admin.database();
        const orders = db.ref(`orders`);

        // load all orders
        orders.on("value", function (snapshot) {
            // return OK status code and loaded orders array
            ctx.status = 200;
            ctx.body = snapshot.val();
        }, function (error) {
                ctx.status = 400;
                ctx.body = error;
        });

       

    }

    @request("get", "/orders/{uid}")
    @summary("Find order by uid")
    @path({
        id: { type: "string", required: true, description: "uid of order" }
    })
    public static async getOrder(ctx: BaseContext): Promise<void> {

        // get database reference for order
        const db = admin.database();
        const orders = db.ref(`orders` + +ctx.params.uid );

        // load order by id
        orders.on("value", function (snapshot) {
            // return OK status code and loaded users array
         const order = snapshot.val();
            if (order) {
                // return OK status code and loaded order object
                ctx.status = 200;
                ctx.body = order;
            } else {
                // return a BAD REQUEST status code and error message
                ctx.status = 400;
                ctx.body = "The order you are trying to retrieve doesn't exist in the db";
            }
        }, function (error) {
            ctx.status = 400;
            ctx.body = error;
        });



    }

    @request("post", "/orders")
    @summary("Create an order")
    @body(orderSchema)
    public static async createOrder(ctx: BaseContext): Promise<void> {

        // get database reference for order
        const db = admin.database();
        const orders = db.ref(`orders`);

        // build up entity order to be saved

       const orderToBeSaved = {
            address: {
                city: ctx.request.body.city,
                country: ctx.request.body.country,
                street: ctx.request.body.street,
                zip: ctx.request.body.zip
            },
            bookingDate: ctx.request.body.bookingDate,
            customer: {
                name: ctx.request.body.name,
                phone: ctx.request.body.phone,
                email: ctx.request.body.email
            },
            title: ctx.request.body.title,
        }

        // validate order
        const errors: ValidationError[] = await validate(orderToBeSaved); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else {
            // save the order contained in the POST body
            const order = orders.push(orderToBeSaved);
            // return CREATED status code and updated order
            ctx.status = 201;
            ctx.body = order;
        }
    }

    @request("put", "/orders/{uid}")
    @summary("Update an order")
    @path({
        id: { type: "string", required: true, description: "id of order" }
    })
    @body(updateOrderSchema)
    public static async updateOrder(ctx: BaseContext): Promise<void> {

        // get databasee reefrence for order
        const db = admin.database();
        const orders = db.ref(`orders`);

        // build up entity order to be saved

        const orderToBeUpdated = {
            bookingDate: ctx.request.body.bookingDate,
            title: ctx.request.body.title,
        }

        // validate user entity
        const errors: ValidationError[] = await validate(orderToBeUpdated); // errors is an array of validation errors


        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } 
        // else if (!await userRepository.findOne(userToBeUpdated.id)) {
        //     // check if a user with the specified id exists
        //     // return a BAD REQUEST status code and error message
        //     ctx.status = 400;
        //     ctx.body = "The user you are trying to update doesn't exist in the db";
        // } else if (await userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), email: userToBeUpdated.email })) {
        //     // return BAD REQUEST status code and email already exists error
        //     ctx.status = 400;
        //     ctx.body = "The specified e-mail address already exists";
        // } 
        else {
            // save the user contained in the PUT body
            const order = orders.update(orderToBeUpdated);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = order;
        }

    }

}
