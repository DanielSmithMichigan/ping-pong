import os
import glob
import numpy as np
from PIL import Image
import noise  # pip install noise
from scipy.optimize import minimize

# ======================
# Helper Functions
# ======================

def compute_histogram(img_arr, bins=64):
    """
    Compute a normalized histogram for each channel in the image.
    Returns a (3, bins) array for R, G, and B channels.
    """
    hist = np.zeros((3, bins), dtype=np.float32)
    bin_edges = np.linspace(0, 256, bins + 1)
    for i in range(3):
        channel_data = img_arr[:, :, i].flatten()
        counts, _ = np.histogram(channel_data, bins=bin_edges)
        hist[i] = counts / counts.sum()
    return hist

def compute_sample_histograms(sample_dir, bins=64):
    """
    Loads sample images from sample_dir and computes the average histogram per channel.
    Returns:
        target_hist: np.array shape (3, bins) containing averaged histograms.
        image_size: (width, height) based on the first sample image.
    """
    hist_list = []
    sample_files = glob.glob(os.path.join(sample_dir, "*"))
    image_size = None
    for f in sample_files:
        try:
            img = Image.open(f).convert("RGB")
            img_arr = np.array(img).astype(np.float32)
            if image_size is None:
                image_size = img.size  # (width, height)
            hist = compute_histogram(img_arr, bins)
            hist_list.append(hist)
        except Exception as e:
            print(f"Could not process {f}: {e}")
    if not hist_list:
        raise ValueError("No valid sample images found in the directory.")
    target_hist = np.mean(hist_list, axis=0)
    return target_hist, image_size

def compute_average_color(sample_dir):
    """
    Computes the average color (R, G, B) over all sample images in sample_dir.
    """
    sample_files = glob.glob(os.path.join(sample_dir, "*"))
    colors = []
    for f in sample_files:
        try:
            img = Image.open(f).convert("RGB")
            arr = np.array(img, dtype=np.float32)
            avg = np.mean(arr, axis=(0, 1))
            colors.append(avg)
        except Exception as e:
            print(f"Error processing {f}: {e}")
    if not colors:
        raise ValueError("No valid sample images found in the directory.")
    return np.mean(colors, axis=0)

def generate_perlin_noise(width, height, scale, octaves, persistence):
    """
    Generate a 2D Perlin noise array of shape (height, width) that is periodic.
    """
    noise_arr = np.zeros((height, width))
    for y in range(height):
        for x in range(width):
            nx = x * scale
            ny = y * scale
            noise_arr[y][x] = noise.pnoise2(nx, ny,
                                             octaves=int(round(octaves)),
                                             persistence=persistence,
                                             repeatx=width, repeaty=height, base=0)
    # Normalize to [0, 1]
    min_val, max_val = noise_arr.min(), noise_arr.max()
    if max_val - min_val > 0:
        noise_arr = (noise_arr - min_val) / (max_val - min_val)
    return noise_arr

def generate_tileable_speck_mask(height, width, tile_size, spec_prob, seed=42):
    """
    Generate a tileable boolean mask for speck noise.
    A small random mask of shape (tile_size, tile_size) is generated with a fixed seed,
    tiled to cover the full image, and then cropped to (height, width).
    """
    rng = np.random.default_rng(seed)
    small_mask = rng.random((tile_size, tile_size))
    small_bool = small_mask < spec_prob
    reps_y = int(np.ceil(height / tile_size))
    reps_x = int(np.ceil(width / tile_size))
    tiled_mask = np.tile(small_bool, (reps_y, reps_x))
    mask = tiled_mask[:height, :width]
    return mask

def generate_image(params, image_size, speck_tile_size=32):
    """
    Generate a synthetic, perfectly tiling image using a two-stage process:
      1. Blend the background and noise color using tileable Perlin noise.
      2. Overlay a tileable speck noise layer.
    
    Parameters (total 12):
      [0-2] : Background color (R, G, B) in [0, 255]
      [3]   : Noise amplitude (blend factor for Perlin noise, in [0, 1])
      [4]   : Perlin scale (controls frequency, in [0.001, 0.05])
      [5]   : Perlin octaves (integer in [1, 10])
      [6]   : Perlin persistence (in [0, 1])
      [7-9] : Noise color for blending (R, G, B) in [0, 255]
      [10]  : Speck probability (chance per pixel, in [0, 0.2])
      [11]  : Speck strength (blend factor for specks, in [0, 1])
    
    Returns:
        gen_img: np.array of shape (height, width, 3) with values in [0, 255].
    """
    width, height = image_size
    # Unpack parameters
    bg_color = np.array(params[0:3])
    noise_amp = params[3]
    perlin_scale = params[4]
    perlin_octaves = params[5]
    perlin_persistence = params[6]
    noise_color = np.array(params[7:10])
    spec_prob = params[10]
    spec_strength = params[11]
    
    # Stage 1: Generate smooth, tileable noise blend.
    perlin_noise = generate_perlin_noise(width, height, perlin_scale, perlin_octaves, perlin_persistence)
    weight = noise_amp * perlin_noise
    weight = weight[..., None]  # shape (height, width, 1)
    bg_img = np.ones((height, width, 3), dtype=np.float32) * bg_color
    noise_img = np.ones((height, width, 3), dtype=np.float32) * noise_color
    blended_img = bg_img * (1 - weight) + noise_img * weight
    
    # Stage 2: Overlay tileable speck noise.
    speck_mask = generate_tileable_speck_mask(height, width, tile_size=speck_tile_size, spec_prob=spec_prob, seed=42)
    speck_layer = blended_img.copy()
    speck_layer[speck_mask, :] = blended_img[speck_mask, :] * (1 - spec_strength) + noise_img[speck_mask, :] * spec_strength

    gen_img = np.clip(speck_layer, 0, 255)
    return gen_img

def objective(params, target_hist, image_size, bins=64):
    """
    Objective function: computes the sum of squared differences between
    per-channel histograms of the generated image and the target histograms.
    """
    gen_img = generate_image(params, image_size)
    gen_hist = compute_histogram(gen_img, bins)
    loss = np.sum((gen_hist - target_hist) ** 2)
    print(f"Params: {np.round(params,2)} => Loss: {loss:.6f}")
    return loss

# ======================
# Main Pipeline
# ======================

if __name__ == "__main__":
    sample_dir = "samples"  # Folder containing your sample images.
    output_image_path = "generated/tileable_background.png"
    os.makedirs("generated", exist_ok=True)
    
    # Compute target histograms from samples.
    target_hist, image_size = compute_sample_histograms(sample_dir, bins=64)
    print("Target Histograms (per channel):")
    print(target_hist)
    print(f"Image size used: {image_size}")
    
    # Compute average color from samples.
    avg_color = compute_average_color(sample_dir)
    print(f"Average background color from samples: {np.round(avg_color, 2)}")
    
    # Set initial parameters:
    # Background: use average color.
    # Noise color: slightly darker than average (subtract 20, clipped to 0).
    init_bg = avg_color
    init_noise_color = np.clip(avg_color - 20, 0, 255)
    
    # Note: We lower the perlin scale to produce a longer-wavelength (slowly varying) noise pattern.
    initial_params = [
        init_bg[0], init_bg[1], init_bg[2],   # Background color (R, G, B)
        0.5,                                  # Noise amplitude (blend factor)
        0.005,                                # Perlin scale (long wavelength)
        3.0,                                  # Perlin octaves
        0.5,                                  # Perlin persistence
        init_noise_color[0], init_noise_color[1], init_noise_color[2],  # Noise color for blending
        0.05,                                 # Speck probability (chance per pixel)
        0.8                                   # Speck strength
    ]
    
    # Define bounds for parameters.
    bounds = [
        (0, 255), (0, 255), (0, 255),  # Background color R, G, B
        (0, 1),                       # Noise amplitude
        (0.001, 0.05),                # Perlin scale (keep it low for longer wavelength)
        (1, 10),                      # Perlin octaves
        (0, 1.0),                     # Perlin persistence
        (0, 255), (0, 255), (0, 255),  # Noise color for blending R, G, B
        (0, 0.2),                     # Speck probability
        (0, 1)                        # Speck strength
    ]
    
    # Run optimizer (if desired). If you already have good parameters,
    # you can skip optimization and use initial_params directly.
    result = minimize(
        objective,
        initial_params,
        args=(target_hist, image_size, 64),
        method="L-BFGS-B",
        bounds=bounds,
        options={'maxiter': 300, 'disp': True}
    )
    
    optimized_params = result.x
    print("\nOptimized Parameters:")
    print(np.round(optimized_params, 3))
    
    # Generate the final tileable image.
    final_img_arr = generate_image(optimized_params, image_size)
    final_img = Image.fromarray(final_img_arr.astype(np.uint8))
    final_img.save(output_image_path)
    print(f"Tileable background image saved to: {output_image_path}")
    
    # Optional: Create a composite grid to visually verify tiling.
    tile = final_img
    grid_cols = 2
    grid_rows = 2
    tile_width, tile_height = tile.size
    composite = Image.new('RGB', (grid_cols * tile_width, grid_rows * tile_height))
    for i in range(grid_rows):
        for j in range(grid_cols):
            composite.paste(tile, (j * tile_width, i * tile_height))
    composite.save("generated/tileable_composite.png")
    print("Composite tiling image saved to: generated/tileable_composite.png")
