import {  JwtPayload, verify } from "jsonwebtoken";

import dotenv from 'dotenv'
dotenv.config();

import { NextRequest, NextResponse } from "next/server";
import { chats } from "@/models/chats";
import connect from "@/dbConfig/dbConfig";

interface chat {
    type: string,
    message: string
}

export async function POST(req: NextRequest) {

    const { recents }:{ recents:Array<chat> } = await req.json();


    
    if(recents.length){

        const cookie = req.cookies.get('RAG')?.value || "";
        const secret_key = process.env.SECRET_KEY || "";

    
    
        try {
    
            await connect();
    
            const verification = await verify(cookie, secret_key) as JwtPayload;

            if(verification){
                
                const chat = await chats.findOne({ userID: verification.id });

                if(chat){
    
                    const prevChat = chat.chats;
                    const newChats = [...prevChat,recents];

                    await chats.findOneAndUpdate({ userID: verification.id }, { chats: newChats });
                    
                    return NextResponse.json({
                        msg: "chats saved",
                        status: 200
                    });
    
                }else{
    
                    await new chats({
                        userID: verification.id,
                        chats: [recents]
                    }).save();
                    
                    return NextResponse.json({
                        msg: "chats saved",
                        status: 200
                    })
    
                }
    
            }
            else{
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
    else{
        return NextResponse.json({
            msg: "Nothing to save",
            status: 200
        })
    }

}