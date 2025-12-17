import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 10,               // docelowo < 10MB
    maxWidthOrHeight: 2560,     // limit rozdzielczości 4K
    useWebWorker: true,         
    initialQuality: 0.9,        // wysoka jakość
  };

  try {
    return await imageCompression(file, options);
  } catch (err) {
    console.error("Błąd kompresji:", err);
    return file; // fallback — wyśle oryginał
  }
};
