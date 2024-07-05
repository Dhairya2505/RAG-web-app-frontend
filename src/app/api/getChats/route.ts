import {  JwtPayload, verify } from "jsonwebtoken";

import dotenv from 'dotenv'
dotenv.config();

import { NextRequest, NextResponse } from "next/server";
import { chats } from "@/models/chats";
import connect from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {

    const cookie = req.cookies.get('RAG')?.value || "";
    const secret_key = process.env.SECRET_KEY || "";

    try {

        await connect();
        const verification = await verify(cookie, secret_key) as JwtPayload;

        if(verification){
            const chat = await chats.findOne({ userID: verification.id });
            if(chat){
                return NextResponse.json({
                    chats: chat.chats,
                    status: 200
                })
            } else{
                return NextResponse.json({
                    chats: 'No chats',
                    status: 201
                })
            }

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