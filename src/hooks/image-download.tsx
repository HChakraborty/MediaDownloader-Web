const downloadImage = async (url: string, title?: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;

    // Extract file extension from URL or default to jpg
    const cleanUrl = url.split('?')[0].split('#')[0]; // remove query/hash
    const extensionMatch = cleanUrl.match(/\.(\w+)$/);
    const fileExtension = extensionMatch ? extensionMatch[1] : 'jpg';

    // Sanitize title and form final filename
    const sanitizedTitle = title?.replace(/[\/\\:*?"<>|]/g, '-'); // avoid illegal characters
    const fileName = sanitizedTitle
      ? `${sanitizedTitle}.${fileExtension}`
      : `image-${Date.now()}.${fileExtension}`;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Image download failed:', error);
  }
};

export default downloadImage;
