
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

Talk2Me runs split GGUF shards directly in the browser through Wllama. There is no backend API, localhost model server, or sideloading requirement for the web version, so the app can be published as static HTML, CSS, and JavaScript on GitHub Pages.

The user's browser still needs enough free RAM/disk to fetch and hold the shards before Wllama initializes them. A 2.4 GB browser model is realistic on some desktops and high-memory devices, but may fail on phones or storage-constrained browsers. If that happens, publish a smaller quantization for mobile users.

Use the **Generation** panel's **Context Size** field before loading a model to type the Wllama context window in tokens. Larger values can keep more conversation available to the model, but they use more memory and require reloading the model after a change.

Do not commit the current RoLLM shards to this Pages repo:

- GitHub blocks normal repository files larger than 100 MiB.
- Published GitHub Pages sites may be no larger than 1 GB.
- The current five-shard RoLLM GGUF is about 2.4 GB total, so even smaller shard sizes would still exceed the Pages site size limit.

## Local Static Test

Run a plain static file server:

```text
npm run serve
```

Then open:

```text
http://127.0.0.1:4173/
```

Talk2Me's model picker points at the RoLLM1 release shards:

```text
https://github.com/ExoCore-Kernel/RoLLM1-models/releases/download/v0.2-beta/RoLLM1-pro-Q4_K_M-00001-of-00005.gguf
https://github.com/ExoCore-Kernel/RoLLM1-models/releases/download/v0.2-beta/RoLLM1-pro-adult-Q4_K_M-00001-of-00005.gguf
```

GitHub release assets do not reliably allow browser JavaScript `fetch()` from every site origin, so Talk2Me uses normal browser downloads and then loads the local files you select. Wllama loads the split GGUF from the five selected shard files.

### How to download a RoLLM model

1. Open Talk2Me in a browser with internet access.
2. In the **Model** card, choose **RoLLM-Pro** or **RoLLM-Pro-adult** from the Runtime dropdown.
3. Click **Download GGUF Files**. Talk2Me opens direct browser downloads for all five `.gguf` shards. If your browser asks, allow multiple downloads.
4. In **Generation**, choose the context size you want for this model load.
5. After the downloads finish, click **Choose downloaded shards** and select all five `.gguf` files for the same model.
6. Click **Load Selected Files** and wait until the status says the selected model is ready. Keep the tab open while loading because the shards are large. On typical desktops this can take several minutes, and slower CPUs, mobile browsers, or low-memory devices can take longer. The status line shows elapsed time while Wllama parses and initializes the five GGUF shards.

If you want to download the files manually, open the release page and download every shard for the model you want:

```text
https://github.com/ExoCore-Kernel/RoLLM1-models/releases/tag/v0.2-beta
```

The adult model files are named like this and must all be kept together:

```text
RoLLM1-pro-adult-Q4_K_M-00001-of-00005.gguf
RoLLM1-pro-adult-Q4_K_M-00002-of-00005.gguf
RoLLM1-pro-adult-Q4_K_M-00003-of-00005.gguf
RoLLM1-pro-adult-Q4_K_M-00004-of-00005.gguf
RoLLM1-pro-adult-Q4_K_M-00005-of-00005.gguf
```

## Adult Debug Checkbox

Adult mode is intentionally a single local checkbox for debugging. There is no camera, MobileAgeNet, or gate flow in this debug UI.
