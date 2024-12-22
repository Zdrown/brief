import fs from 'node:fs';
import path from 'node:path';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';


// Decode credentials if they are stored in GCLOUD_SERVICE_KEY_BASE64
if (process.env.GCLOUD_SERVICE_KEY_BASE64) {
  const keyPath = path.join('/tmp', 'service-account-key.json');
  const decoded = Buffer.from(process.env.GCLOUD_SERVICE_KEY_BASE64, 'base64');
  fs.writeFileSync(keyPath, decoded);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
}

export async function POST(req) {
  const { text } = await req.json();

  if (!text) {
    return new Response(JSON.stringify({ error: "No text provided." }), { status: 400 });
  }

  const client = new TextToSpeechClient();
  
  const request = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Studio-M', // Using Wavenet D voice
    },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    return new Response(response.audioContent, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate audio." }), { status: 500 });
  }
}
