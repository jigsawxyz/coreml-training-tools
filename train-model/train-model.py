import turicreate as tc

print "About to start learning data from download-images/training_data"

# Load images
data = tc.image_analysis.load_images('../download-images/training_data', with_path=True)

# From the path-name, create a label column
#print data['path']

data['label'] = data['path'].apply(lambda path: path.split("/")[-2])

# Save the data for future use
data.save('data.sframe')
data.explore()

# Make a train-test split
train_data, test_data = data.random_split(0.8)

# Automatically picks the right model based on your data.
model = tc.image_classifier.create(data, target='label')

# Save predictions to an SArray
predictions = model.predict(data)

# # Evaluate the model and save the results into a dictionary
metrics = model.evaluate(test_data)
print(metrics['accuracy'])

# # Save the model for later use in Turi Create
model.save('Classifier.model')

# Export for use in Core ML
model.export_coreml('Classifier.mlmodel')