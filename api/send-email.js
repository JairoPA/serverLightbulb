const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Configurar encabezados CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier dominio
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Encabezados permitidos

  // Manejo de preflight requests (método OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Responder a OPTIONS sin procesar más
    return;
  }

  if (req.method === 'POST') {
    const { email, code } = req.body;

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'preciadojairo82@gmail.com', // Tu correo
        pass: 'fgfv fcnt cwqr rwva', // Contraseña de la aplicación
      },
    });

    try {
      // Enviar el correo
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
