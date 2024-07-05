import {  JwtPayload, verify } from "jsonwebtoken";

import dotenv from 'dotenv'
dotenv.config();

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const cookie = req.cookies.get('RAG')?.value || "";
    const secret_key = process.env.SECRET_KEY || "";

    try {
        
        const verification = await verify(cookie, secret_key) as JwtPayload;
    
        if(verification){
            const response = NextResponse.json({
                msg: "Log out",
                status: 200
            }) 
            response.cookies.set('RAG', "");   
            return response;
        } else{
            return NextResponse.json({
                msg: "Something went wrong",
                status: 500
            })
        }

    } catch (error) {
        return NextResponse.json({
            msg: "Something went wrong",
            status: 500
        })
    }

}