import nodemailer from 'nodemailer';

// Middleware para habilitar CORS
const enableCORS = (req, res) => {
  const allowedOrigins = [
    'https://instalaciones-a47g.vercel.app', // Dominio de tu app web
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cachea la respuesta preflight por 1 día
};

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'preciadojairo82@gmail.com', // Tu correo
    pass: 'fgfv fcnt cwqr rwva', // Contraseña de la aplicación
  },
});

// Handler principal
export default async function handler(req, res) {
  enableCORS(req, res); // Aplica CORS a todas las solicitudes

  if (req.method === 'OPTIONS') {
    // Respuesta preflight para solicitudes CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://instalaciones-a47g.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end(); // 204: No Content
    return;
  }

  if (req.method === 'POST') {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Faltan campos requeridos: email o code' });
    }

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
