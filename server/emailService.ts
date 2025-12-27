import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { type Subscriber, type Message } from '@shared/schema';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private fromEmail: string;
  private adminEmails: string[];
  private smtpTransporter: nodemailer.Transporter | null;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || process.env.SMTP_FROM || 'noreply@gracecommunity.org';
    const adminEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'admin@gracecommunity.org';
    this.adminEmails = adminEmails
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === 'true'
      : smtpPort === 465;

    if (smtpHost && smtpUser && smtpPass) {
      this.smtpTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        logger: process.env.DEBUG_SMTP === 'true',
        debug: process.env.DEBUG_SMTP === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      this.smtpTransporter = null;
    }
  }

  /**
   * Send a message to all active subscribers
   */
  async sendMessageToSubscribers(message: Message, subscribers: Subscriber[]): Promise<{ success: number; failed: number }> {
    if (!this.smtpTransporter && !process.env.SENDGRID_API_KEY) {
      throw new Error('Email provider not configured');
    }

    const template = this.createMessageTemplate(message);
    let successCount = 0;
    let failedCount = 0;

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        try {
          await this.sendEmail({
            to: subscriber.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
            // Add unsubscribe link
            htmlContent: template.html + this.getUnsubscribeFooter(subscriber.email)
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error);
          failedCount++;
        }
      });

      await Promise.allSettled(promises);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success: successCount, failed: failedCount };
  }

  /**
   * Send welcome email to new subscriber
   */
  async sendWelcomeEmail(subscriber: Subscriber): Promise<boolean> {
    if (!this.smtpTransporter && !process.env.SENDGRID_API_KEY) {
      throw new Error('Email provider not configured');
    }

    const template = this.createWelcomeTemplate(subscriber);

    try {
      await this.sendEmail({
        to: subscriber.email,
        subject: template.subject,
        html: template.html,
        text: template.text
      });
      return true;
    } catch (error) {
      console.error(`Failed to send welcome email to ${subscriber.email}:`, error);
      return false;
    }
  }

  /**
   * Send contact form submission to admin
   */
  async sendContactFormEmail(formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    if (!this.smtpTransporter && !process.env.SENDGRID_API_KEY) {
      throw new Error('Email provider not configured');
    }

    const template = this.createContactFormTemplate(formData);

    try {
      await this.sendEmail({
        to: this.adminEmails,
        subject: template.subject,
        html: template.html,
        text: template.text,
        replyTo: formData.email
      });
      return true;
    } catch (error) {
      console.error('Failed to send contact form email:', error);
      return false;
    }
  }

  /**
   * Create HTML template for church messages
   */
  private createMessageTemplate(message: Message): EmailTemplate {
    const priorityColor = this.getPriorityColor(message.priority);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${message.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
          .priority-high { background: #fee; color: #c00; border: 1px solid #fcc; }
          .priority-medium { background: #fff8e1; color: #f57c00; border: 1px solid #ffcc02; }
          .priority-low { background: #e8f5e8; color: #2e7d32; border: 1px solid #4caf50; }
          .message-content { margin: 20px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .unsubscribe { margin-top: 20px; }
          .unsubscribe a { color: #666; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>United Bethel Presbyterian Church</h1>
            <p>Important Announcement</p>
          </div>
          
          <div class="content">
            <div class="priority-badge priority-${message.priority}">
              ${message.priority.toUpperCase()} PRIORITY
            </div>
            
            <h2>${message.title}</h2>
            
            <div class="message-content">
              ${message.content.replace(/\n/g, '<br>')}
            </div>
            
            <p><strong>Date:</strong> ${message.date}</p>
          </div>
          
          <div class="footer">
            <p>United Bethel Presbyterian Church<br>
            9045 Maier Rd Suite D, Laurel, MD 20723<br>
            Phone: (301) 339-3258</p>
            
            <div class="unsubscribe">
              <p><a href="${process.env.BASE_URL || 'http://localhost:5000'}/unsubscribe?email={{email}}">Unsubscribe from our newsletter</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
United Bethel Presbyterian Church - Important Announcement

${message.priority.toUpperCase()} PRIORITY: ${message.title}

${message.content}

Date: ${message.date}

---
United Bethel Presbyterian Church
9045 Maier Rd Suite D, Laurel, MD 20723
Phone: (301) 339-3258

To unsubscribe, visit: ${process.env.BASE_URL || 'http://localhost:5000'}/unsubscribe?email={{email}}
    `;

    return {
      subject: `[${message.priority.toUpperCase()}] ${message.title} - United Bethel Presbyterian Church`,
      html,
      text
    };
  }

  /**
   * Create welcome email template
   */
  private createWelcomeTemplate(subscriber: Subscriber): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to United Bethel Presbyterian Church</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to United Bethel Presbyterian Church!</h1>
          </div>
          
          <div class="content">
            <h2>Thank you for subscribing!</h2>
            
            <p>Dear ${subscriber.name || 'Friend'},</p>
            
            <p>Welcome to the United Bethel Presbyterian Church family! We're excited to have you join our community and stay connected with us.</p>
            
            <p>You'll now receive:</p>
            <ul>
              <li>Weekly announcements and updates</li>
              <li>Event notifications and reminders</li>
              <li>Special messages from our pastoral team</li>
              <li>Community news and celebrations</li>
            </ul>
            
            <p>We look forward to sharing our journey of faith with you!</p>
            
            <p>Blessings,<br>
            The United Bethel Presbyterian Church Team</p>
          </div>
          
          <div class="footer">
            <p>United Bethel Presbyterian Church<br>
            9045 Maier Rd Suite D, Laurel, MD 20723<br>
            Phone: (301) 339-3258</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Welcome to United Bethel Presbyterian Church!

Dear ${subscriber.name || 'Friend'},

Welcome to the United Bethel Presbyterian Church family! We're excited to have you join our community and stay connected with us.

You'll now receive:
- Weekly announcements and updates
- Event notifications and reminders
- Special messages from our pastoral team
- Community news and celebrations

We look forward to sharing our journey of faith with you!

Blessings,
The United Bethel Presbyterian Church Team

---
United Bethel Presbyterian Church
9045 Maier Rd Suite D, Laurel, MD 20723
Phone: (301) 339-3258
    `;

    return {
      subject: 'Welcome to United Bethel Presbyterian Church!',
      html,
      text
    };
  }

  /**
   * Create contact form email template
   */
  private createContactFormTemplate(formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${formData.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${formData.email}</div>
            </div>
            
            ${formData.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${formData.phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${formData.subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
Subject: ${formData.subject}

Message:
${formData.message}
    `;

    return {
      subject: `Contact Form: ${formData.subject}`,
      html,
      text
    };
  }

  /**
   * Get priority color for styling
   */
  private getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#c00';
      case 'medium': return '#f57c00';
      case 'low': return '#2e7d32';
      default: return '#666';
    }
  }

  /**
   * Get unsubscribe footer
   */
  private getUnsubscribeFooter(email: string): string {
    return `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
        <p>You received this email because you subscribed to United Bethel Presbyterian Church updates.</p>
        <p><a href="${process.env.BASE_URL || 'http://localhost:5000'}/unsubscribe?email=${email}" style="color: #666;">Unsubscribe</a></p>
      </div>
    `;
  }

  /**
   * Send email using SendGrid
   */
  private async sendEmail(emailData: {
    to: string | string[];
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
    htmlContent?: string;
  }): Promise<void> {
    if (this.smtpTransporter) {
      await this.smtpTransporter.sendMail({
        to: emailData.to,
        from: this.fromEmail,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.htmlContent || emailData.html,
        replyTo: emailData.replyTo,
      });
      return;
    }

    const msg = {
      to: emailData.to,
      from: this.fromEmail,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.htmlContent || emailData.html,
      replyTo: emailData.replyTo,
    };

    await sgMail.send(msg);
  }
}

export const emailService = new EmailService();
