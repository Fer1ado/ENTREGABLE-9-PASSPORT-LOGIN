import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    country: String,
    gender: String,
    age:Number,
})

export const userModel = model("users", userSchema)
