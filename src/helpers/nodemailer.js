const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const hb = require('handlebars');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_USER_PASSWORD,
  SMTP_FROM_EMAIL,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: SMTP_USER,
    pass: SMTP_USER_PASSWORD,
  },
});

const getTemplateHtml = async (template, version = 'v1') => {
  try {
    const templateFile = path.join(
      `${__dirname}../../../templates/email/${version}/${template}.hbs`,
    );
    return fs.readFileSync(templateFile, 'utf8');
  } catch (err) {
    return Promise.reject(new Error('Could not load html template'));
  }
};

const Email = async (
  template,
  to,
  payload,
  subject = '',
  adminCopy = false,
  files = [],
  ccList = [],
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const templateData = await getTemplateHtml(template);
      // Render template data in html template
      const htmlTemplate = hb.compile(templateData, { strict: false });
      const renderedHtml = htmlTemplate(payload);
      const contents = {
        from: SMTP_FROM_EMAIL,
        to,
        subject,
        cc: ccList,
        html: renderedHtml,
        priority: 'normal',
      };

      const attachments = [];
      await Promise.all(
        // eslint-disable-next-line array-callback-return
        files.map((file) => {
          const { filePath, fileName, mimetype } = file;
          attachments.push({
            path: filePath,
            filename: fileName,
            contentType: mimetype,
            contentDisposition: 'attachment',
          });
        }),
      );

      if (attachments && attachments.length > 0) {
        contents.attachments = attachments;
      }
      if (adminCopy) {
        contents.bcc = process.env.ADMIN_EMAIL;
      }
      const emailDeliveryInfo = await transporter.sendMail(contents);
      resolve(emailDeliveryInfo.messageId);
    } catch (error) {
      logger.error(`Error in sending email ${error}`);
      reject(error);
    }
  });
};

module.exports = { Email };
