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

        // get databasee reefrence for order
        const db = admin.database();
        const orders = db.ref(`orders`);

        // load all orders
        orders.on("value", function (snapshot) {
            console.log(snapshot.val());
            ctx.status = 200;
            ctx.body = snapshot.val();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject);
        });

        // return OK status code and loaded users array

    }

    @request("get", "/orders/{uid}")
    @summary("Find order by id")
    @path({
        id: { type: "number", required: true, description: "id of order" }
    })
    public static async getOrder(ctx: BaseContext): Promise<void> {

        // get databasee reefrence for order
        const db = admin.database();
        const orders = db.ref(`orders`);

        // load order by id
        // const user: User | undefined = await userRepository.findOne(+ctx.params.id || 0);

        if (orders) {
            // return OK status code and loaded order object
            ctx.status = 200;
            ctx.body = orders;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The order you are trying to retrieve doesn't exist in the db";
        }

    }

    @request("post", "/orders")
    @summary("Create an order")
    @body(orderSchema)
    public static async createOrder(ctx: BaseContext): Promise<void> {

        // get databasee reefrence for order
        const db = admin.database();
        const orders = db.ref(`orders`);

        // build up entity order to be saved

       const orderToBeSaved = {
            address: {
                city: ctx.request.body.address.city,
                country: ctx.request.body.address.country,
                street: ctx.request.body.address.street,
                zip: ctx.request.body.address.zip
            },
            bookingDate: ctx.request.body.bookingDate,
            customer: {
                name: ctx.request.body.customer.name,
                phone: ctx.request.body.customer.phone,
                email: ctx.request.body.customer.email
            },
            title: ctx.request.body.title,
        }

        // validate user entity
        const errors: ValidationError[] = await validate(orderToBeSaved); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else {
            // save the user contained in the POST body
            const order = orders.set(orderToBeSaved);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = order;
        }
    }

    @request("put", "/orders/{uid}")
    @summary("Update an order")
    @path({
        id: { type: "number", required: true, description: "id of order" }
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
            const order = orders.set(orderToBeUpdated);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = order;
        }

    }

    // @request("delete", "/users/{id}")
    // @summary("Delete user by id")
    // @path({
    //     id: { type: "number", required: true, description: "id of user" }
    // })
    // public static async deleteUser(ctx: BaseContext): Promise<void> {

    //     // get a user repository to perform operations with user
    //     const userRepository = getManager().getRepository(User);

    //     // find the user by specified id
    //     const userToRemove: User | undefined = await userRepository.findOne(+ctx.params.id || 0);
    //     if (!userToRemove) {
    //         // return a BAD REQUEST status code and error message
    //         ctx.status = 400;
    //         ctx.body = "The user you are trying to delete doesn't exist in the db";
    //     } else if (ctx.state.user.email !== userToRemove.email) {
    //         // check user's token id and user id are the same
    //         // if not, return a FORBIDDEN status code and error message
    //         ctx.status = 403;
    //         ctx.body = "A user can only be deleted by himself";
    //     } else {
    //         // the user is there so can be removed
    //         await userRepository.remove(userToRemove);
    //         // return a NO CONTENT status code
    //         ctx.status = 204;
    //     }

    // }

    // @request("delete", "/testusers")
    // @summary("Delete users generated by integration and load tests")
    // public static async deleteTestUsers(ctx: BaseContext): Promise<void> {

    //     // get a user repository to perform operations with user
    //     const userRepository = getManager().getRepository(User);

    //     // find test users
    //     const usersToRemove: User[] = await userRepository.find({ where: { email: Like("%@citest.com")} });

    //     // the user is there so can be removed
    //     await userRepository.remove(usersToRemove);

    //     // return a NO CONTENT status code
    //     ctx.status = 204;
    // }

}
