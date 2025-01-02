import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// 1) Decode GCLOUD credentials if GCLOUD_SERVICE_KEY_BASE64 is set
if (process.env.GCLOUD_SERVICE_KEY_BASE64) {
  const keyPath = path.join('/tmp', 'service-account-key.json');
  const decoded = Buffer.from(process.env.GCLOUD_SERVICE_KEY_BASE64, 'base64');
  fs.writeFileSync(keyPath, decoded);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
}

// 2) A map from dropdown voice names to actual TTS voice IDs
const VOICE_MAP = {
  ZACH: "en-US-Journey-D",
  CAITLIN: "en-US-Journey-F",
  ALEX: "en-US-Studio-M",
  ANSEL: "en-US-Casual-K",
};

// 3) Define the POST route (Next.js 13+ App Router)
export async function POST(request) {
  try {
    // parse the JSON body
    const { text, voiceName } = await request.json();

    // text is required
    if (!text) {
      console.log("[TTS] No text received in request body!");
      return NextResponse.json(
        { error: "No text provided." },
        { status: 400 }
      );
    }

    console.log("[TTS] Incoming request:");
    console.log("     voiceName:", voiceName);
    console.log("     text (first 50 chars):", text.slice(0, 50), "...");

    // choose voice from VOICE_MAP or fallback
    const chosenVoice = VOICE_MAP[voiceName] || "en-US-Journey-D";
    console.log("[TTS] Resolved chosenVoice to:", chosenVoice);

    // init TTS client
    const client = new TextToSpeechClient();

    // request body for TTS
    const ttsRequest = {
      input: { text },
      voice: {
        languageCode: "en-US",
        name: chosenVoice,
      },
      audioConfig: { audioEncoding: "MP3" },
    };

    // 4) synthesize
    const [response] = await client.synthesizeSpeech(ttsRequest);
    console.log("[TTS] Synthesis complete, returning MP3 data.");

    // 5) return raw MP3 data
    return new NextResponse(response.audioContent, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });

  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio." },
      { status: 500 }
    );
  }
}
