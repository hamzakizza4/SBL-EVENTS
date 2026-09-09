/**
 * Image Optimizer Utility
 * Resizes and compresses user-uploaded images in the browser
 * Ensures images easily fit within Firestore document limits and load instantly.
 */

export const compressImageFileOrDataUrl = (
  input: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve) => {
    // If input is an external web URL (starts with http/https), return as-is
    if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
      resolve(input);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof input === 'string' ? input : '');
          return;
        }

        // Draw image smoothly
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Image optimization fallback:', err);
        resolve(typeof input === 'string' ? input : '');
      }
    };

    img.onerror = () => {
      resolve(typeof input === 'string' ? input : '');
    };

    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(input);
    }
  });
};
