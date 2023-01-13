import { Job } from "bull";
import nodemailer from "nodemailer";
import { transporter } from "../../config/configMail";

const emailProcess = async (job: Job) => {
    let info = await transporter().sendMail(job.data);
    console.log("Message sent: %s", info.messageId);

    return nodemailer.getTestMessageUrl(info);
};

export default emailProcess;