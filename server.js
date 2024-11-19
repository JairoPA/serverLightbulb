const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' })); // Permitir solicitudes desde cualquier origen
app.use(express.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Host del servidor SMTP de Gmail
    port: 465, // Puerto para conexiones seguras (SSL)
    secure: true, // true para usar SSL, false para usar TLS o STARTTLS
    auth: {
      user: 'preciadojairo82@gmail.com', // Tu correo
      pass: 'fgfv fcnt cwqr rwva', // Contraseña de la aplicación
    },
  });

// Endpoint para enviar correos
app.post('/send-email', async (req, res) => {
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
});

// Inicia el servidor
const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
