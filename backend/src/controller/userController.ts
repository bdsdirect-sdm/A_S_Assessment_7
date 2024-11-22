import { Response } from "express"
import sendOrder from "../utils/mailer"

export const sendmail = (req:any, res:Response) =>{
    try{
        const {email} = req.body
        console.log("mail", email)
        sendOrder(email);
        res.status(200).json({message: 'Email sent successfully'})
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message":"something went wrong"});
    }
}