const admin = require("firebase-admin");

// Inicializar Firebase con las credenciales desde la variable de entorno
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS); // Leer credenciales desde el Secret
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Falta el parámetro userId." });
    }

    try {
      const userRef = db.collection("BD").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists()) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      // Devolver todos los dispositivos y horarios
      const devices = userDoc.data()?.devices || {};
      return res.status(200).json({ devices });
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
      return res.status(500).json({ error: "Error interno al obtener datos." });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido." });
  }
};
