const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'kyu.chahiye23@gmail.com',
    pass: 'qbbl goin xcrf xttr',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function testEmail() {
  console.log('🧪 Testing Gmail SMTP connection...\n');
  
  try {
    // Test connection
    console.log('1️⃣ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    // Send test email
    console.log('2️⃣ Sending test email...');
    const info = await transporter.sendMail({
      from: 'kyu.chahiye23@gmail.com',
      to: 'kyu.chahiye23@gmail.com', // Send to yourself
      subject: '🧪 KolabIT Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f97316;">✅ Email System Working!</h2>
          <p>This is a test email from your KolabIT backend.</p>
          <p>If you received this, your email configuration is correct! 🎉</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Test Date: ${new Date().toLocaleString()}<br>
            From: KolabIT Email System
          </p>
        </div>
      `,
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('\n✨ Check your email inbox (kyu.chahiye23@gmail.com)');
    console.log('💡 Also check spam/junk folder if you don\'t see it\n');
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 Authentication failed. Please check:');
      console.error('   1. Email address is correct');
      console.error('   2. App Password is correct (spaces should be there)');
      console.error('   3. 2FA is enabled in Google Account');
      console.error('   4. Generated a new App Password from: https://myaccount.google.com/apppasswords');
    }
  }
}

testEmail();
