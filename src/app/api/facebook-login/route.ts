import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const requestBody = await req.json();

    //Server Verifications-
    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${requestBody.userId}/?fields=id,name,picture,email&access_token=${requestBody.accessToken}`

    const response = await fetch(urlGraphFacebook);
    const data = await response.json();

    console.log(data);


    //So, if there no data then return error, otherwise return true by saving all data into database.

    if (!data) return new Response("Something went wrong", { status: 400 });

    //Write database logic here. As I am not using any database here right now. So, comment if you want database integrations with mongoDb and postgreSQL. I will create separate video for each database. So comment who want the second part of the video?



    return Response.json({ success: true });
} 