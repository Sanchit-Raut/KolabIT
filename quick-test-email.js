const nodemailer = require('nodemailer');

const pass = 'rqbqshpvpupyvbwe'; // Without spaces

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.kolabit@gmail.com',
    pass: pass
  }
});

transporter.sendMail({
  from: '"KolabIT - No Reply" <noreply.kolabit@gmail.com>',
  to: 'kyu.chahiye23@gmail.com',
  subject: '✅ KolabIT Email Test - New Account',
  html: '<h1>SUCCESS!</h1><p>Your new noreply.kolabit@gmail.com email is working perfectly!</p><p>All system emails will now come from this professional address.</p>'
}, (error, info) => {
  if (error) {
    console.log('❌ ERROR:', error.message);
  } else {
    console.log('✅ SUCCESS! Email sent from noreply.kolabit@gmail.com!');
    console.log('📧 Check kyu.chahiye23@gmail.com inbox NOW!');
  }
  process.exit(0);
});
