import turicreate as tc

model = tc.load_model("Classifier.model")
model.export_coreml('Classifier.mlmodel')