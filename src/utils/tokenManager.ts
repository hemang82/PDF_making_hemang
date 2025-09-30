// URL for iLovePDF authentication
const URL = 'https://api.ilovepdf.com/v1/auth';

// Token validity is 2 hours, but we refresh after 1 hour for safety
const TOKEN_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// Public project key (safe to expose)
const PUBLIC_KEY = process.env.ILOVEPDF_API_PUBLIC_KEY;

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAuthToken(): Promise<string | null> {
  // Check if the public key is defined
  if (!PUBLIC_KEY) {
    throw new Error('[TokenManager Error]: Missing ILOVEPDF_PUBLIC_KEY in environment variables.');
  }

  const now = Date.now();

  // Return cached token if still valid
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  // Fetch new token from iLovePDF
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_key: PUBLIC_KEY }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData?.error?.message || 'Unknown error from Auth API';
      throw new Error(`[TokenManage Error]: Failed to fetch token — ${message}`);
    }

    const { token } = await response.json();

    if (!token || typeof token !== 'string') {
      throw new Error('[TokenManager Error]: Invalid token response from API');
    }

    // Save token and timestamp in cache
    cachedToken = token;
    // Set token expiry to 1 hour from now
    tokenExpiry = now + TOKEN_REFRESH_INTERVAL_MS;

    return token;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const formatted = `[TokenManager Error]: Could not retrieve token — ${message}`;
    console.error(formatted);
    throw new Error(formatted);
  }
}
