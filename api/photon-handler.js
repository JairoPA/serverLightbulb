const admin = require("firebase-admin");

// Inicializa Firebase solo si no está inicializado
// Ruta al archivo JSON de la cuenta de servicio
const serviceAccount = require("./credenciales.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

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
      return console.log("este son los horarios", horarios);
    } catch (error) {
      console.error("Error al obtener horarios:", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
};
