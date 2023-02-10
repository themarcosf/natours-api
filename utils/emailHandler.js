const pug = require("pug");
const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * mailtrap.io : staging and dev environment for email testing and validation
 * nodemailer : provides well-known email services (eg gmail) pre-configured
 * @dev activate in gmail account: "less secure app" option
 */
class EmailHandler {
  constructor(_user, _url) {
    this.to = _user.email;
    this.firstName = _user.name.split(" ")[0];
    this.url = _url;
    this.from = `Natours Co. <${process.env.EMAIL_FROM}>`;
  }

  /** create transporter (smtp server) */
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(_template, _subject) {
    const _html = pug.renderFile(
      `${__dirname}/../views/email/${_template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject: _subject,
      }
    );

    const _mailOptions = {
      from: this.from,
      to: this.to,
      subject: _subject,
      html: _html,
      text: convert(_html, { wordwrap: 130 }),
    };

    await this.newTransport().sendMail(_mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Natours!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)!"
    );
  }
}

module.exports = EmailHandler;
