// controllers/contactController.js
const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    const { name, phone, gsm, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Lütfen zorunlu alanları doldurun.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `Nevk Yachts - Yeni İletişim Formu Mesajı: ${name}`,
        html: `
            <h3>Yeni bir iletişim isteği aldınız:</h3>
            <ul>
                <li><strong>Ad Soyad:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Telefon:</strong> ${phone || 'Belirtilmemiş'}</li>
                <li><strong>GSM:</strong> ${gsm || 'Belirtilmemiş'}</li>
            </ul>
            <hr>
            <h4>Mesaj:</h4>
            <p>${message}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Mesajınız başarıyla gönderildi.' });
    } catch (error) {
        console.error('Email gönderme hatası:', error);
        res.status(500).json({ success: false, error: 'Mesaj gönderilirken bir sorun oluştu.' });
    }
};