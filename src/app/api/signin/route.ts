import { users } from "@/models/users";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import dotenv from 'dotenv';
import connect from "@/dbConfig/dbConfig";
dotenv.config();

export async function POST(req: NextRequest){

    const { username, password } = await req.json();

    try {
        await connect();
        const user = await users.findOne({ username });
            
        if(user){
            if(await compare(password, user.password)){
                const secret_key =  process.env.SECRET_KEY || "";
                const token = await jwt.sign({
                    id: user._id,
                    username: username,
                }, secret_key);
        
                const response = NextResponse.json({
                    msg: "User signed in",
                    status: 200
                }) 
                response.cookies.set('RAG', token);   
                return response;
            }
            else{
                return NextResponse.json({
                    msg: "*Incorrect password",
                    status: 401
                }) 
            }
        }else{

            return NextResponse.json({
                msg: "*User not found",
                status: 401
            }) 

        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            msg: "*Something went wrong",
            status: 500
        }) 
        
    }



}