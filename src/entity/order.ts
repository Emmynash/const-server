import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsEmail } from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 80
    })
    @Length(10, 80)
    name: string;

    @Column({
        length: 100
    })
    @Length(10, 100)
    @IsEmail()
    email: string;
}

export const orderSchema = {
        city: { type: "string", required: true, example: "Berlin" },
        country: { type: "string", required: true, example: "Germany" },
        street: { type: "string", required: true, example: "Wriezener str. 12" },
        zip: { type: "string", required: true, example: "13055" },
        bookingDate: { type: "number", required: true, example: 1554284950000 },
        name: { type: "string", required: true, example: "Emmanuel Akita" },
        email: { type: "string", required: true, example: "e.akita@email.com" },
        phone: { type: "string", required: true, example: "0123456789" },
        title: { type: "string", required: true, example: "Test order 1" },
};

export const updateOrderSchema = {
    bookingDate: { type: "number", required: true, example: 1554284950000 },
    title: { type: "string", required: true, example: "Test order 1" },
}