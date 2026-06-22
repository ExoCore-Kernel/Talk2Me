# MobileAgeNet

Place the local MobileAgeNet ONNX model here:

```text
assets/mobileagenet/mobileagenet.onnx
```

The NSFW gate will stay locked until this model exists and returns an estimated age of at least `25`.

Do not use `mobilenetv2-10.onnx` here; that file is an ImageNet classifier and returns 1000 category scores, not an age estimate.

The app stores only local metadata in `localStorage`; it does not store captured images.
