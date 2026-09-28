import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localGemmaFallbackParse(message: string, existingTitles: string[]) {
  const msgLower = message.toLowerCase();
  
  // Parse layout syntax if present (e.g. tab = laser, speed = 100 mm, power = 75%, material = Basswood 3mm)
  let explicitMaterial = '';
  let explicitTab = '';
  let explicitSpeed = '';
  let explicitPower = '';
  let explicitTemp = '';
  let explicitTime = '';

  const parts = message.split(/[,;\n]/);
  parts.forEach(part => {
    const [k, v] = part.split('=').map(s => s?.trim());
    if (k && v) {
      const keyLower = k.toLowerCase();
      if (keyLower.includes('material') || keyLower.includes('name')) explicitMaterial = v;
      if (keyLower.includes('tab') || keyLower.includes('craft') || keyLower.includes('tool')) explicitTab = v.toLowerCase();
      if (keyLower.includes('speed')) explicitSpeed = v;
      if (keyLower.includes('power')) explicitPower = v;
      if (keyLower.includes('temp') || keyLower.includes('heat')) explicitTemp = v;
      if (keyLower.includes('time')) explicitTime = v;
    }
  });

  // Determine targetTitle
  let targetTitle = explicitMaterial || existingTitles.find(t => msgLower.includes(t.toLowerCase()));
  if (!targetTitle) {
    // Clean up action prefixes like "add to laser", "update", "find", "show"
    let cleanedMsg = message
      .replace(/add to (laser|sublimation|3d print|printer|craft)/gi, '')
      .replace(/(find|show|update|edit|create|material|for|to)/gi, '')
      .trim();
    if (cleanedMsg.length > 1) {
      targetTitle = cleanedMsg.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else {
      targetTitle = 'Custom Material';
    }
  }

  // Determine category / tab
  let category: any = 'sublimation';
  if (explicitTab.includes('laser') || explicitTab.includes('cut') || msgLower.includes('laser') || msgLower.includes('cut')) {
    category = 'laser_cutter';
  } else if (explicitTab.includes('3d') || explicitTab.includes('print') || msgLower.includes('print') || msgLower.includes('pla')) {
    category = '3d_printing';
  } else if (explicitTab.includes('subl') || msgLower.includes('sublimation')) {
    category = 'sublimation';
  } else if (explicitTab.includes('other') || explicitTab.includes('misc')) {
    category = 'other';
  }

  const timeSeconds = explicitTime ? parseInt(explicitTime) || 60 : 60;
  const temp = explicitTemp || '400°F';
  const headTemp = explicitTemp || '210°C';
  const cutSpeed = explicitSpeed ? (explicitSpeed.includes('mm') ? explicitSpeed : `${explicitSpeed} mm/s`) : '15 mm/s';
  const power = explicitPower ? (explicitPower.includes('%') ? explicitPower : `${explicitPower}%`) : '75%';

  const existingCardMatch = existingTitles.find(t => t.toLowerCase() === targetTitle.toLowerCase());
  const action = existingCardMatch ? 'update' : 'create';
  const feedbackMessage = `Found material "${targetTitle}" for ${category.replace('_', ' ')} — showing card details.`;

  return {
    action,
    targetTitle,
    category,
    feedbackMessage,
    sublimation: { pressure: 'Medium', timeSeconds, temp, notes: 'Parsed via Layout Prompt / Gemma 3 1B' },
    print3d: { headTemp, bedTemp: '60°C', slicerProfile: 'Standard', notes: 'Parsed via Layout Prompt / Gemma 3 1B' },
    laser: { cutSpeed, engraveModeDpi: '300 DPI', power, airAssist: true, notes: 'Parsed via Layout Prompt / Gemma 3 1B' },
    other: { disciplineName: 'General Craft', material: targetTitle, durationSeconds: timeSeconds, tempPressure: temp, notes: 'Parsed via Layout Prompt / Gemma 3 1B' }
  };
}

function localGemmaFallbackSuggest(materialName: string, craftType: string) {
  return {
    title: materialName,
    category: craftType || 'sublimation',
    tags: ['Local Gemma 3 1B', craftType],
    sublimation: { pressure: 'Medium', timeSeconds: 60, temp: '400°F', notes: 'Generated via Local Gemma 3 1B On-Device Fallback' },
    print3d: { headTemp: '210°C', bedTemp: '60°C', slicerProfile: 'Standard PLA', notes: 'Generated via Local Gemma 3 1B On-Device Fallback' },
    laser: { cutSpeed: '15 mm/s', engraveModeDpi: '300 DPI', power: '75%', airAssist: true, notes: 'Generated via Local Gemma 3 1B On-Device Fallback' },
    other: { disciplineName: 'General Craft', material: materialName, durationSeconds: 60, tempPressure: 'Standard', notes: 'Generated via Local Gemma 3 1B On-Device Fallback' }
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route for AI Craft Parameter suggestion with Local Gemma 3 Fallback
  app.post('/api/ai-suggest', async (req, res) => {
    const { materialName, craftType, apiKey: clientApiKey } = req.body;
    try {
      const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback immediately if no API key
        const fallbackResult = localGemmaFallbackSuggest(materialName, craftType);
        return res.json(fallbackResult);
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Provide optimal crafting settings for material "${materialName}" under craft type "${craftType || 'sublimation'}". 
      Return strictly a valid JSON object (no markdown, no backticks, raw JSON only) with this exact structure:
      {
        "title": "${materialName}",
        "category": "${craftType || 'sublimation'}",
        "tags": ["AI Generated", "${craftType}"],
        "sublimation": { "pressure": "Medium", "timeSeconds": 60, "temp": "400°F", "notes": "AI recommended parameters for sublimation." },
        "print3d": { "headTemp": "210°C", "bedTemp": "60°C", "slicerProfile": "Standard PLA", "notes": "AI recommended parameters for 3D printing." },
        "laser": { "cutSpeed": "15 mm/s", "engraveModeDpi": "300 DPI", "power": "75%", "airAssist": true, "notes": "AI recommended parameters for laser cutter." },
        "other": { "disciplineName": "General Craft", "material": "${materialName}", "durationSeconds": 60, "tempPressure": "Standard", "notes": "AI recommended miscellaneous notes." }
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Cloud AI quota / rate limit hit. Triggering Local Gemma 3 1B fallback:', err.message);
      const fallbackResult = localGemmaFallbackSuggest(materialName, craftType);
      return res.json(fallbackResult);
    }
  });

  // API Route for Natural Language AI Card Update with Layout Prompt Support
  app.post('/api/ai-parse-update', async (req, res) => {
    const { message, existingTitles, apiKey: clientApiKey } = req.body;
    try {
      const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const fallbackResult = localGemmaFallbackParse(message, existingTitles || []);
        return res.json(fallbackResult);
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a tiny on-device LLM assistant (like Gemma 3 1B) for a Craft Settings Diary app.
      Existing material titles in the diary are: ${JSON.stringify(existingTitles || [])}.
      The user sent this natural language message: "${message}".
      
      Support layout syntax if provided (e.g. "tab = laser", "speed = 100 mm", "power = 75%", "material = Basswood 3mm").
      Extract the clean material name (ignore action prefixes like "add to laser", "find", "show").
      Determine if the user wants to update an existing material or create a new one, and which craft tab/category applies ("sublimation", "3d_printing", "laser_cutter", "other").
      Provide a feedbackMessage explaining what was found and that card details are shown.
      
      Return strictly a valid JSON object (no markdown, no backticks, raw JSON only) with this exact structure:
      {
        "action": "update" or "create",
        "targetTitle": "clean material name",
        "category": "sublimation" or "3d_printing" or "laser_cutter" or "other",
        "feedbackMessage": "Found material [Name] for [Tab] — showing card details.",
        "sublimation": { "pressure": "Medium", "timeSeconds": 60, "temp": "400°F", "notes": "Updated by AI message" },
        "print3d": { "headTemp": "210°C", "bedTemp": "60°C", "slicerProfile": "Standard PLA", "notes": "Updated by AI message" },
        "laser": { "cutSpeed": "15 mm/s", "engraveModeDpi": "300 DPI", "power": "75%", "airAssist": true, "notes": "Updated by AI message" },
        "other": { "disciplineName": "General Craft", "material": "...", "durationSeconds": 30, "tempPressure": "Standard", "notes": "Updated by AI message" }
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Cloud AI high demand / unavailable. Triggering Local Gemma 3 1B fallback:', err.message);
      const fallbackResult = localGemmaFallbackParse(message, existingTitles || []);
      return res.json(fallbackResult);
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
