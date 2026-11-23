# Livia-Server

Kleines Backend, über das die Livo-App Livia mit der Claude API antworten lässt. Der API-Schlüssel bleibt auf dem Server – er darf nie in die App gelangen.

Ohne diesen Server funktioniert die App trotzdem: Livia antwortet dann offline aus der eingebauten Wissensbasis (FAQ, Kursinhalte und Erklärungen zu allen Fragen).

## Starten

Voraussetzung: Node.js ≥ 22.18 (führt TypeScript direkt aus).

```bash
cd server
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
# → Livia-Server läuft auf http://localhost:8787
```

App gegen den Server starten (im Projektwurzelverzeichnis):

```bash
EXPO_PUBLIC_LIVIA_API_URL=http://<deine-LAN-IP>:8787 npx expo start
```

Auf dem Handy mit Expo Go ist `localhost` das Handy selbst – nimm die LAN-IP deines Rechners oder eine öffentliche URL.

## Konfiguration

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | – | API-Schlüssel (Pflicht) |
| `PORT` | `8787` | HTTP-Port |
| `LIVIA_MODEL` | `claude-opus-5-5` | Claude-Modell |
| `LIVIA_ALLOWED_ORIGINS` | `*` | Erlaubte Web-Origins (CORS), kommagetrennt, z. B. `https://app.mylivo.app` |
| `LIVIA_RATE_LIMIT` | `30` | Anfragen pro IP in 10 Minuten |

## API

`POST /api/livia`

```json
{
  "messages": [{ "role": "user", "content": "Wie berechne ich den Anhalteweg?" }],
  "context": {
    "question": "…",
    "options": ["…"],
    "solution": "…",
    "explanation": "…"
  }
}
```

Antwort: `{ "reply": "…" }`. `context` ist optional und wird gesendet, wenn jemand im Quiz auf „Frag Livia“ tippt.

`GET /health` → `{ "ok": true, "model": "…" }`

## Hinweise

- Antworten laufen mit `effort: "low"` – für einen Lern-Chat reicht das und hält Antwortzeit und Kosten niedrig.
- Server-seitige Fallbacks (`fallbacks: "default"`) sind aktiv: Lehnt das Modell eine Anfrage ab, antwortet automatisch ein Ausweichmodell.
- Die App begrenzt KI-Nachrichten ohne Livo Plus auf 10 pro Tag. Der Server begrenzt zusätzlich pro IP. Für den Produktivbetrieb solltest du Anfragen außerdem an ein Nutzerkonto binden (z. B. per Token aus dem mylivo.app-Login).
- Deployment: Das Skript ist ein einfacher Node-HTTP-Server und läuft auf jeder Plattform mit Node 22 (Render, Fly.io, Railway, eine VM …). Setze dort `ANTHROPIC_API_KEY` als Secret.
