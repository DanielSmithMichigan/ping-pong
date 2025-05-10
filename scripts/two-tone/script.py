import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load the image in grayscale
image_cv = cv2.imread('input.png', cv2.IMREAD_GRAYSCALE)

# Resize the image
resized_cv = cv2.resize(image_cv, (256, 256))

# Apply binary thresholding
_, two_tone_cv = cv2.threshold(resized_cv, 128, 255, cv2.THRESH_BINARY)

# Invert the image for dark-on-light style
inverted_cv = cv2.bitwise_not(two_tone_cv)

# Save the result
output_cv_path = "output.png"
cv2.imwrite(output_cv_path, inverted_cv)

# Display the result using matplotlib
fig, ax = plt.subplots(1, 2, figsize=(10, 5))
ax[0].imshow(resized_cv, cmap='gray')
ax[0].set_title("Grayscale Image (OpenCV)")
ax[0].axis("off")
ax[1].imshow(inverted_cv, cmap='gray')
ax[1].set_title("Two-Tone Image (OpenCV)")
ax[1].axis("off")
plt.tight_layout()
plt.show()

output_cv_path
