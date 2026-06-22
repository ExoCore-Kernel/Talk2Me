
# Talk2Me -- A local, free, and open source alternative to roleplay apps.

## Why you'll love Talk2Me

- Its completely private
 No data is ever sent to any servers.
- Its completely local
The custom trained AI chatbots run on-device.
- Its open-source
Feel free to pruise through the surce code.
- Age verification is on-device
NSFW content must be age verified though a 
local AI model. Your photo is never sent to a server.


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

To ensure NSFW content is never shown to underage users, a on device, local face recognition age check is required to use the NSFW models.
