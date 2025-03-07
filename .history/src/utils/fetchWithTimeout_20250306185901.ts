/**
 * Fetch dengan timeout untuk mengatasi masalah jaringan
 * @param url URL yang akan diakses
 * @param options Opsi fetch
 * @param timeout Timeout dalam milidetik (default: 15000ms)
 * @returns Promise dengan hasil fetch
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 15000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}; 