const admin = require("firebase-admin");

// Inicializa Firebase si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "lightbulb-5fcc3",
      clientEmail: "firebase-adminsdk@lightbulb-5fcc3.iam.gserviceaccount.com",
      privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDMywnNo28oN2Ft\ntn0CZVLVU+DL9uwB8l5PSp2anKoNYCD16QudcvQ75T3voU6KgDzbdcLoytftLLmY\n1VDTfk9AeNyshbOhRdT7572fRomwEVe0aF3roO7dt0zqS0noxlgVlrCAFGg7zCpF\nKITLXAdDF/8/AzK8DNrAcphYFxWgmZ4GMoY9mgrIo8TADqe+9VTEfvNWDYPf1e8Y\nNSyd6bA8S4Y8Cc9rfKUXKVQimEEy/oDht70Bso4rdDJGGzNh1n1eU8l4go+BWzlB\n0PaLl1QgHtXBS1s1CODxYTnxa1w79+v5veEphDuUSbtHYJT8Vp3CxM7MWN5wdCqH\nB1CG7x4rAgMBAAECggEAIZ7Hijnler20wfUuiqElux3dDr8Hub4XW38NZp+Hj1CT\nuKs8m+mOTPLyew+JPFWXKBQqHluGnUo1YfDLJx1aV2RAHhaJCdXUBFLkH2zOF9iR\nBG4J1TADZuS7vM8FYDCHr2ugqDYxcnevDNF9E4GVM5+R6L9WqeaWVve5KOUJSOcD\n26CscUz64+dXW4zuIkGBdhHMbu4SpS7x82Qk1zNjq7Fhc93C3imvqZbxgc5A0Q+e\npN8KSIAHJXQzdZxf6ov87yRbG+Htbagf0UM4DNAm9wgxHq+aCaNk0wTAX/G0hGal\nhfjobRsiWckmpq3jfl1pZ69kHlGtN9AUKTCbrJXpEQKBgQD1rH3HTvEaJBOeVzcB\nora6wARh0dwYCh7kRsa4xuzW5dVJuTl3vLNSBP643VyRktBgil0Rp/y3HerMpLkW\n8C2TU19rNW80gFBPHy9jsChfCuFH6sfFC9ZpbW1Lp/QN7t1hn2Vxpt6Jy5OyLB8F\nX3nrxnsUMHRmb1gqy7wtiFmMgwKBgQDVZqlAa4VdBwRs3cJohuXhYsrKOVlJTbfT\nA1ldj3UVUg8JxreIGv0Oj7aPi8OtjFNY41F1FlF2INllBCf+WK2pXhWB4EIUXpZu\nd+6QT3jcZ3gJQrA0+vqWY+mSMAEoUslbZH7INtN8s5Ht/D1YZ5DSUby67Ng50aIa\nTZvHJRfHOQKBgQDc1dwOcAC8rddQyzcv6jL1tit6PunoVhikvJZffLljByBt7+kf\nn+lVfhX22U0fsmhLj7TPbUD23ha1NBEI9IcTWqt4NIUtHXaTWQYBR1VS8fXF7t76\nWoS3Kl1H18bDS4eG/IB05DpAhVXToGOWMdfnv/fdEx1fAxGvDoquJ1XPvwKBgQCV\nimRObUo+X119gITsRKOwpk8fGML1uE15xB4Kjy3n6+H34tXXvbnZS2IOA03zPqNl\nZZ4+Y45gLjLJM/lmpfPD/NcrdOA5b/MQpGB7pgU2xhb6vk3GQp35ZzhVJeiZvjG2\nJp0lZi4bc6ZuU9UVLzXv/DE5+CCpm7pxnjLsgZTBGQKBgQDYsqqzxGMexXNgdGTC\nU3Dz1CZkRPa4XqqI9+S3yL4gAGriQ9dCtSv32/IsyeAax/0gvadS1cbKmFAckvIC\ng37zD7+wk2CpkW5KxpKzrbKRXBCFc+7+Ks2oGHWZt17SW6678DWRmohrVzykV3hJ\nL+FMWUWYttifA/3wWm4pfz4zMA==\n-----END PRIVATE KEY-----\n`,
    }),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method === "GET") {
    // Maneja solicitudes GET
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "Falta el parámetro userId" });
    }

    try {
      const docRef = db.collection("BD").doc(userId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const data = docSnap.data();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  } else if (req.method === "POST") {
    // Maneja solicitudes POST (tu lógica original)
    const { userId, pin, horarios } = req.body;

    if (!userId || !pin || !horarios) {
      return res.status(400).json({ error: "Faltan datos obligatorios: userId, pin o horarios." });
    }

    try {
      const deviceRef = db.collection("BD").doc(userId);

      await deviceRef.update({
        [`devices.${pin}.horarios`]: horarios,
      });

      return res.status(200).json({ message: "Horario actualizado correctamente." });
    } catch (error) {
      console.error("Error al actualizar horarios:", error);
      return res.status(500).json({ error: "Error al actualizar horarios." });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido." });
  }
};
