import nodemailer from 'nodemailer'
import ejs from 'ejs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Code } from './consts.utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_SENDER } = process.env

class Email {
    #createTransport() {
        const port = parseInt(MAIL_PORT) || 587
        return nodemailer.createTransport({
            host: MAIL_HOST,
            port: port,
            secure: false,
            requireTLS: false,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        })
    }

    #getAndRenderTemplate(templateFile, data = {}) {
        return new Promise((resolve, reject) => {
            ejs.renderFile(__dirname + `/../views/${templateFile}.ejs`, data, (err, str) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(str)
                }
            })
        })
    }

    /**
     * send an email with the given template and data
     * @param {Object} options options
     * @param {String} options.to  email address of the recipient
     * @param {String} options.subject  subject of the email
     * @param {String} options.templateFile  name of the template file
     * @param {!Object=} options.data  data to be passed to the template
     * @param {String} options.from  email address of the sender
     * @param {!String=} options.text  for clients with plaintext support only
     * 
     * @returns {Promise<void>}
     */
    send(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let mailOptions = {
                    from: MAIL_SENDER,
                    to: options.to,
                    subject: options.subject,
                    text: options.text,
                    html: await this.#getAndRenderTemplate(options.templateFile, options.data)
                }
                await this.#createTransport().sendMail(mailOptions)
                // console.info('email sent')
                resolve()
            } catch (e) {
                e.httpResponseCode = Code.EMAIL_ERROR
                reject(e)
            }
        })
    }
}

export default new Email()
