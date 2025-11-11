const router = require("express").Router();
const User = require("../models/userModel");
import commonUtil from "../commonUtils";

/**
 * Get all savings
 * @route GET /api/savings
 * @header { token }
 */
router.get("/", auth, async (req, res) => {
    try {
        // const users = await User.find({ verifyMail: true });
        // for (const user of users) {
        //     console.log(`Sending reminder email to ${user.email}`);
        //     await commonUtil.sendReminderEmail(user.email, user.userName);
        // }
        await commonUtil.sendReminderEmail('lehaitrieu48@gmail.com', "Test User");
        res.status(200).json({ success: true, message: "Reminders sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;