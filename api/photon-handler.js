const admin = require("firebase-admin");
const { GoogleAuth } = require("google-auth-library");

// Inicializa Firebase solo si no está inicializado
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE); // Cargar credenciales desde variable de entorno

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Función para obtener un Access Token usando google-auth-library
async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Reemplazar saltos de línea
    },
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token; // Devuelve solo el token
}

module.exports = async (req, res) => {
  // Verifica que sea un método GET
  if (req.method === "GET") {
    const { userId, pin } = req.query;

    if (!userId || !pin) {
      return res.status(400).json({ error: "Faltan parámetros: userId o pin" });
    }

    try {
      // Obtiene los datos del documento de Firebase
      const docRef = db.collection("BD").doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const device = doc.data()?.devices?.[pin];
      if (!device) {
        return res.status(404).json({ error: `Dispositivo ${pin} no encontrado` });
      }

      // Devuelve los horarios asociados al dispositivo
      const horarios = device.horarios || {};
      return res.status(200).json({ success: true, horarios });
    } catch (error) {
      console.error("Error al obtener horarios:", error.message);

      // Intentar autenticación con Access Token en caso de error
      try {
        const accessToken = await getAccessToken();
        console.log("Access Token obtenido:", accessToken);
        return res.status(500).json({
          error: "Error interno del servidor, pero el token se generó correctamente.",
        });
      } catch (tokenError) {
        console.error("Error al obtener Access Token:", tokenError.message);
        return res.status(500).json({
          error: "Error interno del servidor y fallo al generar Access Token.",
        });
      }
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
};
