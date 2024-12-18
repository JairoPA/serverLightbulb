import nodemailer from 'nodemailer';

const enableCORS = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Cambia '*' por tu dominio si es necesario
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'preciadojairo82@gmail.com', // Tu correo
    pass: 'fgfv fcnt cwqr rwva', // Contraseña de la aplicación
  },
});

export default async function handler(req, res) {
  enableCORS(req, res); // Asegúrate de que CORS se aplica en todas las rutas

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Respuesta adecuada para preflight
  }

  if (req.method === 'POST') {
    const { email, code } = req.body;

    try {
      await transporter.sendMail({
        from: '"Lightbulb Support" <preciadojairo82@gmail.com>',
        to: email,
        subject: 'Tu código de verificación',
        text: `Hola, tu código de verificación es: ${code}`,
      });

      return res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).json({ error: 'Error al enviar el correo' });
    }
  }

  res.setHeader('Allow', ['POST', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
