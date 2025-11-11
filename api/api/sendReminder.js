import { User } from "../models/userModel";
import commonUtil from "../commonUtils";

export default async function handler(req, res) {
    try {
        const users = await User.find({ verifyMail: true });
        for (const user of users) {
            console.log(`Sending reminder email to ${user.email}`);
            await commonUtil.sendReminderEmail(user.email, user.userName);
        }
        res.status(200).json({ success: true, message: "Reminders sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
}
