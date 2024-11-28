const { google } = require("googleapis");

// Credenciales del servicio
const serviceAccount = {
  type: "service_account",
  project_id: "lightbulb-5fcc3",
  private_key_id: "c0ebf194d623b52a24a4cab7c57114b4c7a1c154",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbVgLmZNjtF1hQ\nipWb92/aM4WuEoqL4dFMQ+56c9RFX3rqexkzgLowY/awzPonRl4YGG03GQv3W9NT\nT+qIUOWVARTITS83eydh8A1Upy4iLxCdawCQDHZl5FHpIHd1VTm8rbC6uHKLS9rx\nbQCPFb7ao8RRAF4j9z7tltS1+zKzoyIrWaIeqU2I1aMlf9rVVqwH9IvgnmafwdSs\nOuuuCWVDnLY3eYE0hBxe/0eLJLj9xR4IvOkgctOeHjLNSg3KCPMljXVE5tQcS9k2\nd1toFRlLOvc7a8lNHzmscNgS3BI7NPxkx3sxUSX1U531qOAW31TFPReFpfG7zBcE\nsRO7BZJPAgMBAAECggEAUAQKTcvHmYL1PHi6SKpVm1hFcfIgqhRJGxYDN5fu/hnt\niQI8eN4CzqmBMxGsRsy0gfzTRxDznRtaNmAGsxE0GA5LayFBUu+yN9fvvQy6V00t\nNgh1rZdmUBihyzcFbYAYbp08xnmIjAmxx3aZCBoKRNAOy/Ai5+MIiXuHgRYxcnep\nb4+uiLk1/h+pLV+2l7RXL8a/ru+Y/UMx3oUzM2Dwr8ac1k+D7chqcZt86l2R3uER\nD6TOpKwJ86gH4nXRV08FmvIiOaGsvka1Bbv6tG0Lsm96GNyLQrLyS/bZoW/7F2XZ\nLa8gZblcbStluePCSomt+vYpWmIyPbo2cS5ECRtqEQKBgQD3XEbnf+T1/4GEes0h\nHmUkHomU1j1+A7Y6ZKpPonlEt79eqRn0CrBxERHjzLbf1MZnGoPQyJyx4PJ9z79k\nGRKC1zZm8TVrOkMEbft7wZZKqP2IPjiZG6bUD4NAZGg/w3lzud3jbssctd9P+APL\nRzsRh5kUYQWHDQZQ6WuKQxxocQKBgQDi/yjDk/if0bGKFtxrt4BAj6m6NZXqtw7v\nxsu+oSfjl3aFqzRp6p9HxHBC/GH+GJ5ZCikH4Wz8/9zNlemTf6aZZtYTuzrqpyNz\nwKQAJ2qKu39AjAwLtHKLmqgSt9d591xx96e20CxAkVo46lbjTqS7zNzOiWTvb1pD\ndHO7bPEGvwKBgQCABctQv3nB9AaViXUnYfLY2dE9LhDPap5i5HzdEGsRLMSn+n9L\nNkkRi9MlgmtXt2kkLa3xXhLzYUg/40jcRrm07Cvk5YxPPe03mrCg4ZWmeIYXgJSM\ncapLcOfuaMknz0TJp3X24v3OkzbLzcIw8GHa9cI9sOVKe2w8bkLRYWCPkQKBgFtg\nt/ozQOylL0EVftnl3r0emAabt6Pq2Rpw/mfY3APkXxPkHY9doYz0aPSuQIxXQLc7\nPdUsTAF0xmAELyjvRBOQsDD1N/xqF/1q2Rouw9bhL5K+TcMQeuPz+CDA3P7+Mrq2\nJU+UcZv0Z0tuGlgaunnXODP0Xyt7uexZnpUef9BlAoGAJ7yt0yobUqAcf7mEcX22\nhL/ZIlKMjyKfgLRGHeaK7pkjOk8FIT936qhyvhgsUD8R5IpCje8rF7G4D+1jYXbW\nrH99vj9ADp+pkU7/RDgdAxPOc2+qaax90Be8xSxPUVvQlLk08m55dv4wo3rSp28L\nRL01QMi9+rdC35E5jOYI/1Y=\n-----END PRIVATE KEY-----\n",
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
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

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
