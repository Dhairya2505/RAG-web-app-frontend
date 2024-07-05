import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest){

    const cookie = req.cookies.get('RAG')?.value;

    if(!cookie){
        return NextResponse.redirect('http://localhost:3000/signin');
    }

}

export const config = {
    matcher: ['/mainapp'],
}