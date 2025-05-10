import os
import numpy as np
from PIL import Image
import noise
from scipy.optimize import minimize
import matplotlib.pyplot as plt

# Step 1: Load and analyze samples from the "samples" folder
def compute_sample_stats(samples_dir="samples"):
    stats = {"mean": [], "std": [], "hist": [], "contrast": []}
    for filename in os.listdir(samples_dir):
        if filename.endswith(".png"):
            img_path = os.path.join(samples_dir, filename)
            img = Image.open(img_path).convert("RGB")
            pixels = np.array(img, dtype=np.float32) / 255.0

            # Compute stats
            mean_color = np.mean(pixels, axis=(0, 1))
            std_dev = np.std(pixels, axis=(0, 1))
            hist_r, _ = np.histogram(pixels[:, :, 0], bins=50, range=(0, 1), density=True)
            contrast = np.max(pixels) - np.min(pixels)  # Simple contrast metric

            stats["mean"].append(mean_color)
            stats["std"].append(std_dev)
            stats["hist"].append(hist_r)
            stats["contrast"].append(contrast)
    
    # Average across samples, ensure contrast is 1D
    stats["mean"] = np.mean(stats["mean"], axis=0)
    stats["std"] = np.mean(stats["std"], axis=0)
    stats["hist"] = np.mean(stats["hist"], axis=0)
    stats["contrast"] = np.array([np.mean(stats["contrast"], axis=0)])  # Wrap scalar in 1D array
    return stats

# Step 2: Generate a background with Perlin + salt-and-pepper noise
def generate_background(width, height, base_color, scale, octaves, persistence, perlin_amplitude, noise_color, speck_prob):
    img = np.zeros((height, width, 3), dtype=np.float32)
    
    # Perlin noise layer
    for y in range(height):
        for x in range(width):
            n = noise.pnoise2(x / scale, y / scale, octaves=int(octaves), persistence=persistence)
            n = (n + 1) / 2  # Normalize to [0, 1]
            value = base_color + n * perlin_amplitude * noise_color
            img[y, x] = np.clip(value, 0, 1)

    # Add salt-and-pepper noise (black specks)
    speck_mask = np.random.random((height, width)) < speck_prob
    img[speck_mask] = [0, 0, 0]  # Black specks
    
    return img

# Step 3: Compute stats of a generated image
def compute_generated_stats(img):
    mean_color = np.mean(img, axis=(0, 1))
    std_dev = np.std(img, axis=(0, 1))
    hist_r, _ = np.histogram(img[:, :, 0], bins=50, range=(0, 1), density=True)
    contrast = np.array([np.max(img) - np.min(img)])  # Ensure 1D
    return np.concatenate([mean_color, std_dev, hist_r, contrast])

# Step 4: Loss function for optimization
def loss_function(params, target_stats, width, height):
    base_color = params[0:3]
    scale, octaves, persistence, perlin_amplitude = params[3:7]
    noise_color = params[7:10]
    speck_prob = params[10]
    
    generated = generate_background(width, height, base_color, scale, octaves, persistence, perlin_amplitude, noise_color, speck_prob)
    generated_stats = compute_generated_stats(generated)
    
    target_flat = np.concatenate([target_stats["mean"] * 10, target_stats["std"] * 10, target_stats["hist"], target_stats["contrast"] * 5])
    gen_flat = generated_stats
    return np.sum((target_flat - gen_flat) ** 2)

# Main execution
if __name__ == "__main__":
    print("Analyzing samples...")
    target_stats = compute_sample_stats("samples")
    width, height = 128, 128

    # Initial guess: [base_r, base_g, base_b, scale, octaves, persistence, perlin_amplitude, noise_r, noise_g, noise_b, speck_prob]
    initial_params = np.concatenate([
        target_stats["mean"],           # Base color
        [20.0, 6.0, 0.3, 0.2],         # Scale (smaller for detail), octaves, persistence, higher amplitude
        [0.5, 0.5, 0.5],               # Noise color
        [0.01]                          # Probability of black specks
    ])

    # Bounds
    bounds = [
        (0, 1), (0, 1), (0, 1),        # Base color RGB
        (5, 50), (1, 8), (0.1, 1),     # Scale, octaves, persistence
        (0.05, 0.5),                    # Perlin amplitude
        (-1, 1), (-1, 1), (-1, 1),     # Noise color RGB
        (0.001, 0.1)                    # Speck probability
    ]

    # Optimize
    print("Optimizing parameters...")
    result = minimize(
        loss_function,
        initial_params,
        args=(target_stats, width, height),
        bounds=bounds,
        method="L-BFGS-B",
        options={"maxiter": 150}
    )

    # Extract optimized parameters
    optimized_params = result.x
    base_color = optimized_params[0:3]
    scale, octaves, persistence, perlin_amplitude = optimized_params[3:7]
    noise_color = optimized_params[7:10]
    speck_prob = optimized_params[10]

    # Generate final image
    print("Generating final image...")
    final_img = generate_background(width, height, base_color, scale, octaves, persistence, perlin_amplitude, noise_color, speck_prob)
    final_img = (final_img * 255).astype(np.uint8)

    # Save and display
    Image.fromarray(final_img).save("generated_background.png")
    plt.imshow(final_img)
    plt.title("Generated Background with Specks")
    plt.show()

    print("Optimized Parameters:")
    print(f"Base Color: {base_color}")
    print(f"Scale: {scale}, Octaves: {octaves}, Persistence: {persistence}, Perlin Amplitude: {perlin_amplitude}")
    print(f"Noise Color: {noise_color}")
    print(f"Speck Probability: {speck_prob}")