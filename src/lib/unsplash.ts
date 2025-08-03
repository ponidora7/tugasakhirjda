export async function getUnsplashImage(query: string = 'blog'): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop`;
  }
}