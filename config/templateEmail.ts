export const mainOptionsEmail = (email: string, message: string) => (
    {
        from: 'Đỗ Nam Test mail',
        to: email,
        subject: 'Test Nodemailer',
        text: 'Your text is here',
        html: `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">` + message + `</h4>
                <span style="color: black">Đây là mail test</span>
            </div>
        </div>
        `
    }
);