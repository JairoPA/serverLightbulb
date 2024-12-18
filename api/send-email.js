import Cors from 'cors';
import nodemailer from 'nodemailer';

// Configurar CORS
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
  origin: '*', // Permite solicitudes desde cualquier origen (ajusta esto según tus necesidades)
  allowedHeaders: ['Content-Type'], // Puedes agregar otros encabezados si es necesario
});

// Función para ejecutar el middleware CORS
const runCors = (req, res) =>
  new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve();
    });
  });

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'preciadojairo82@gmail.com',
    pass: 'fgfv fcnt cwqr rwva',
  },
});

export default async function handler(req, res) {
  try {
    // Ejecutar el middleware CORS
    await runCors(req, res);

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
  } catch (error) {
    console.error('Error al ejecutar CORS:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}
