const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Usar variables de entorno
    pass: process.env.EMAIL_PASSWORD, // Usar variables de entorno
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, code } = req.body;

    try {
      await transporter.sendMail({
        from: '"Lightbulb Support" <preciadojairo82@gmail.com>',
        to: email,
        subject: 'Tu código de verificación',
        text: `Hola, tu código de verificación es: ${code}`,
      });

      res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ error: 'Error al enviar el correo' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
