# Talk2Me

A static GitHub Pages WebLLM roleplaying site with local persona creation, repository-loaded character packs, and placeholders for:

- `RoLLM1-mini`
- `RoLLM1-pro`

Every chat injects the RoLLM1 roleplay system prompt plus the active persona card. `ADULT_CONTENT_ALLOWED` stays `false` unless the local NSFW age gate passes.

## Run Locally

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

WebLLM needs WebGPU, so use a recent Chromium-based browser.

## Character Repositories

Paste a GitHub repo URL, GitHub tree URL, direct `index.json` URL, or hosted folder URL into the Repositories box.

For a GitHub repo like:

```text
https://github.com/author/character-pack
```

Talk2Me tries:

```text
https://raw.githubusercontent.com/author/character-pack/main/index.json
https://raw.githubusercontent.com/author/character-pack/master/index.json
```

Repository `index.json` format:

```json
{
  "name": "Example Cast",
  "author": "Author Name",
  "itemCount": 1,
  "items": [
    {
      "name": "Avery Vale",
      "description": "A careful detective with a dry sense of humor.",
      "thumbnail": "./thumbnails/avery.svg",
      "character": "./characters/avery.json"
    }
  ]
}
```

Character JSON format:

```json
{
  "name": "Avery Vale",
  "thumbnail": "../thumbnails/avery.svg",
  "systemPrompt": {
    "description": "You are Avery Vale, a private investigator.",
    "personality": "Observant, guarded, dryly funny.",
    "scenario": "A rain-dark office, one unopened case file on the desk.",
    "keywords": ["detective", "mystery", "noir"],
    "opening": "\"Close the door. The interesting cases hate witnesses.\"",
    "instructions": "Keep clues grounded and leave the player's choices open."
  }
}
```

See `examples/character-repository/` for a complete tiny pack.

## Add The WebLLM Models Later

Drop your compiled MLC WebLLM model files into:

```text
models/RoLLM1-mini/
models/RoLLM1-pro/
```

Update `MODEL_OPTIONS` in `app.js` if your generated `.wasm` names differ.

## NSFW Gate

The NSFW gate is intentionally strict:

- Requires a local MobileAgeNet ONNX model at `assets/mobileagenet/mobileagenet.onnx`.
- Stores only pass/fail metadata, estimated age, threshold, and timestamp in `localStorage`.
- Does not store the camera image.
- Requires an estimated age of at least `25`.
- Keeps NSFW locked if the model is missing, camera access fails, or the estimate is under `25`.

I could not find an official public MobileAgeNet model artifact to download, so the app is wired for the local file but does not include the weights.

## GitHub Pages

Commit this folder to a GitHub repo, then enable Pages from the `main` branch root. The `.nojekyll` file is included so GitHub Pages serves model assets as plain static files.
