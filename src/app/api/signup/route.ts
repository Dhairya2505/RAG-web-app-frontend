import { NextResponse, NextRequest } from "next/server";
import { hash } from 'bcrypt';
import connect from "@/dbConfig/dbConfig";
import { users } from "@/models/users";

export async function POST(req: NextRequest) {

    const { username, email, password } = await req.json();
    
    const hashedPassword = await hash(password, 10);

    try {
        await connect();
        let user;
        try {
            user = await new users({
                username: username,
                email: email,
                password: hashedPassword
            }).save();
            return NextResponse.json({
                msg:"User created successfully",
                status: 200
            })
        } catch (error: any) {
            if(error.errorResponse?.keyPattern?.username == 1){
                return NextResponse.json({
                    msg:"*Username taken",
                    status: 409
                })
            } else if(error.errorResponse?.keyPattern?.email == 1){
                return NextResponse.json({
                    msg:"*Email already in use",
                    status: 409
                })
            }
        }
            
    } catch (error) {
        return NextResponse.json({
            msg:"*Something went wrong",
            status: 500
        })

    }

}