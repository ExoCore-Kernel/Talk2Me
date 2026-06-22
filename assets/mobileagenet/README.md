# MobileAgeNet

Place the local MobileAgeNet ONNX model here:

```text
assets/mobileagenet/mobileagenet.onnx
assets/mobileagenet/MobileAgeNet.onnx.data
```

The NSFW gate will stay locked until this model exists and returns an estimated age of at least `25`.

Some MobileAgeNet exports split large weights into `MobileAgeNet.onnx.data`. If your browser says it cannot deserialize tensors or cannot load external data, upload that `.data` file next to `mobileagenet.onnx` with the exact capitalization shown above.

Do not use `mobilenetv2-10.onnx` here; that file is an ImageNet classifier and returns 1000 category scores, not an age estimate.

The app stores only local metadata in `localStorage`; it does not store captured images.
