// ── Spotify Login (Authorization Code + PKCE) ──────────────────────────────
//
// This is a client-side-only implementation intended for demo/prototype use.
// PKCE lets us do the OAuth code exchange without a client secret, which is
// why this works without a backend yet.
//
// ⚠️ Before handing this off to a real backend:
//   - Move `exchangeCodeForToken` server-side so access/refresh tokens never
//     live in the browser.
//   - Store tokens server-side (session/db) instead of sessionStorage.
//   - Keep using PKCE for the initial redirect — it's still best practice
//     even with a backend in the loop.
//
// Setup required (see .env.example):
//   1. Create an app at https://developer.spotify.com/dashboard
//   2. Add a Redirect URI there that matches VITE_SPOTIFY_REDIRECT_URI exactly
//      (e.g. http://127.0.0.1:5173 for local dev with `npm run dev`)
//   3. Copy the Client ID into .env as VITE_SPOTIFY_CLIENT_ID

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin;

// Scopes needed to power onboarding + profile matching features.
const SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "user-read-recently-played",
].join(" ");

const VERIFIER_KEY = "tastebuds_spotify_verifier";
const TOKEN_KEY = "tastebuds_spotify_token";

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateCodeVerifier(length = 64) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes).slice(0, length);
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

// Kicks off the Spotify login redirect. Call this from a button onClick.
export async function redirectToSpotifyLogin() {
  if (!CLIENT_ID) {
    alert(
      "Missing VITE_SPOTIFY_CLIENT_ID.\n\nAdd a .env file (see .env.example) with your Spotify app's Client ID."
    );
    return;
  }

  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  sessionStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Reads the ?code=... param Spotify appends after the user approves login.
export function getSpotifyAuthCode() {
  const url = new URL(window.location.href);
  return url.searchParams.get("code");
}

export function getSpotifyAuthError() {
  const url = new URL(window.location.href);
  return url.searchParams.get("error");
}

// Strips ?code / ?error / ?state off the URL so a refresh doesn't re-trigger the exchange.
export function clearSpotifyAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.searchParams.delete("error");
  window.history.replaceState({}, document.title, url.pathname + (url.search || ""));
}

// Exchanges the auth code for an access token.
// NOTE: this call happens directly from the browser for demo purposes only.
export async function exchangeCodeForToken(code) {
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) {
    throw new Error("Missing PKCE verifier — please try connecting Spotify again.");
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token exchange failed: ${text}`);
  }

  const token = await res.json();
  token.obtained_at = Date.now();
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  sessionStorage.removeItem(VERIFIER_KEY);
  return token;
}

// Returns a still-valid stored token, or null if missing/expired.
export function getStoredSpotifyToken() {
  const raw = sessionStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    const token = JSON.parse(raw);
    const expired = Date.now() > token.obtained_at + token.expires_in * 1000;
    return expired ? null : token;
  } catch {
    return null;
  }
}

export async function fetchSpotifyProfile(accessToken) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Spotify profile");
  return res.json();
}

export async function fetchSpotifyTopArtists(accessToken, limit = 9) {
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch top artists");
  const data = await res.json();
  return data.items || [];
}

export function logoutSpotify() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
}
