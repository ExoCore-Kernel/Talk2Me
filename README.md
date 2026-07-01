
# Talk2Me -- A local, free, and open source alternative to roleplay apps.

## Why you'll love Talk2Me

- Its completely private
 No data is ever sent to any servers.
- Its completely local
The custom trained AI chatbots run on-device.
- Its open-source
Feel free to pruise through the surce code.
- Debug adult mode is a simple local checkbox
The age camera gate is intentionally removed for debugging builds.


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

## GGUF Model Loading

Talk2Me now uses Wllama, a browser llama.cpp backend that can load GGUF models. The model picker points at the RoLLM1 release shards:

```text
https://github.com/ExoCore-Kernel/RoLLM1-models/releases/download/v0.2-beta/RoLLM1-pro-Q4_K_M-00001-of-00005.gguf
https://github.com/ExoCore-Kernel/RoLLM1-models/releases/download/v0.2-beta/RoLLM1-pro-adult-Q4_K_M-00001-of-00005.gguf
```

The browser pre-caches all five shards for the selected model with the Cache API and Wllama loads the split GGUF by the first shard URL. This cannot make a first download work without internet, but it keeps the large shards around so repeat loads avoid redownloading while the browser keeps site storage.

## Adult Debug Checkbox

Adult mode is intentionally a single local checkbox for debugging. There is no camera, MobileAgeNet, or gate flow in this debug UI.
