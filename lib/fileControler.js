require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const fetch = require("node-fetch");

const download_image = async (
  image_source_url = "https://privatemoviez.icu/wp-content/uploads/2024/11/Cruel-Intentions-2024-min.jpg",
  save_to_path = `${process.cwd()}/media/popo.jpg`
) => {
  try {
    const response = await fetch(image_source_url);

    if (!response.ok) {
      throw new Error("Failed to load the image from the WPI API");
    }

    const buffer = await response.buffer();

    // Ensure the directory exists (create it if it doesn't)
    const dirPath = path.dirname(save_to_path);
    await fs.mkdir(dirPath, { recursive: true });

    await fs.writeFile(save_to_path, buffer);
  } catch (error) {
    throw error;
  }
};


module.exports = {download_image}
