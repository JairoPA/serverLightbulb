const { google } = require("googleapis");

// Credenciales del servicio
const serviceAccount = {
  type: "service_account",
  project_id: "lightbulb-5fcc3",
  private_key_id: "c0ebf194d623b52a24a4cab7c57114b4c7a1c154",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...",
  client_email: "firebase-adminsdk-aszf8@lightbulb-5fcc3.iam.gserviceaccount.com",
  client_id: "116347767832294146955",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-aszf8%40lightbulb-5fcc3.iam.gserviceaccount.com",
};

// Variables globales para el token
let accessToken = null;
let tokenExpiration = null;

// Función para generar un token OAuth 2.0
async function generateOAuth2Token() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  accessToken = tokenResponse.token;
  tokenExpiration = Date.now() + 55 * 60 * 1000;
  console.log("Token generado:", accessToken);
  return accessToken;
}

// Endpoint para manejar solicitudes GET
async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const userId = req.query.userId; // Obtener el userId de la consulta
      if (!userId) {
        return res.status(400).json({ error: "Falta el parámetro userId" });
      }

      if (!accessToken || Date.now() >= tokenExpiration) {
        console.log("Generando un nuevo token...");
        await generateOAuth2Token();
      }

      const url = `https://firestore.googleapis.com/v1/projects/lightbulb-5fcc3/databases/(default)/documents/BD/${userId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const horarios = extractHorarios(data);

      res.json({ success: true, horarios });
    } catch (error) {
      console.error("Error al consultar dispositivos:", error.message || error);
      res.status(500).json({ error: "Error al consultar dispositivos" });
    }
  } else if (req.method === "POST") {
    // Manejar la solicitud POST para recibir photonId y apiKey
    try {
      const { photonId, apiKey } = req.body;

      if (!photonId || !apiKey) {
        return res.status(400).json({ error: "Faltan parámetros: photonId o apiKey." });
      }

      console.log("Datos recibidos:", { photonId, apiKey });

      // Enviar los datos a Particle
      const particleResponse = await sendToParticle(photonId, apiKey);

      res.status(200).json({ success: true, particleResponse });
    } catch (error) {
      console.error("Error al procesar la solicitud POST:", error.message || error);
      res.status(500).json({ error: "Error al procesar la solicitud POST." });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

//mandar a particle
async function sendToParticle(photonId, apiKey, horarios) {
  const particleUrl = `https://api.particle.io/v1/devices/${photonId}/actualizarHorario`;

  try {
    // Convertir los horarios con sus pines a un string JSON
    const horariosString = JSON.stringify(horarios);

    const response = await fetch(particleUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${apiKey}`,
      },
      // Enviar los horarios como un JSON en el parámetro args
      body: `args=${encodeURIComponent(horariosString)}`,
    });

    if (!response.ok) {
      throw new Error(`Error de Particle: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Respuesta de Particle:", data);
    return data;
  } catch (error) {
    console.error("Error al enviar datos a Particle:", error.message || error);
    throw new Error("Error al enviar datos a Particle.");
  }
}

// Función para extraer los horarios
function extractHorarios(data) {
  const devices = data.fields.devices.mapValue.fields;
  const horarios = {};

  for (const [deviceKey, deviceValue] of Object.entries(devices)) {
    const horariosField = deviceValue.mapValue.fields.horarios?.mapValue?.fields || {};
    horarios[deviceKey] = {};

    for (const [horarioKey, horarioValue] of Object.entries(horariosField)) {
      horarios[deviceKey][horarioKey] = {
        on: horarioValue.mapValue.fields.on.stringValue,
        off: horarioValue.mapValue.fields.off.stringValue,
      };
    }
  }

  return horarios;
}

module.exports = handler;
