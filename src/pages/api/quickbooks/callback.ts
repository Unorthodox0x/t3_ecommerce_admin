import { NextApiRequest, NextApiResponse } from "next"
import {qbAuthClient} from "@/server/Quickbooks";

export default function handler(
	request:NextApiRequest, 
	response:NextApiResponse
):void {


	await qbAuthClient.setTokenFromCallback({ request.url })

	return;
}