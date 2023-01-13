import { transporter } from "../../config/configMail";

export class Helper {
    async sendMail(email: string, res: any, req: any) {
        var content = '';
        content += `
            <div style="padding: 10px; background-color: #003375">
                <div style="padding: 10px; background-color: white;">
                    <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
                    <span style="color: black">Đây là mail test</span>
                </div>
            </div>
        `;
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Đỗ Nam Test mail',
            to: email,
            subject: 'Test Nodemailer',
            text: 'Your text is here',
            html: content
        }
        await transporter().sendMail(mainOptions, function(err: any, info: any){
            return err ? false : true;
        });
    }
}