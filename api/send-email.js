import nodemailer from 'nodemailer';

// Función para habilitar CORS
const enableCORS = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite solicitudes de cualquier dominio
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Usar SSL
  auth: {
    user: 'preciadojairo82@gmail.com',
    pass: 'fgfv fcnt cwqr rwva', // Asegúrate de usar la contraseña de aplicación correcta
  },
});

export default async function handler(req, res) {
  // Manejo de opciones (pre-flight request)
  if (req.method === 'OPTIONS') {
    enableCORS(req, res);
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { email, code } = req.body;

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
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
