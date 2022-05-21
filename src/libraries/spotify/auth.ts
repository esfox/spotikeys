import getPkce from 'oauth-pkce';
import { SpotifyApi } from './api';

const spotifyAuthorizeUrl = 'https://accounts.spotify.com/authorize';
const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
const grantType = 'authorization_code';
const scope = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-private',
  'user-library-modify',
  'user-library-read',
  'playlist-modify-private',
  'playlist-read-collaborative',
  'playlist-read-private',
  'playlist-modify-public',
].join(' ');

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
if(!clientId)
  throw new Error('No Spotify Client ID set');

export class SpotifyAuth
{
  static async isLoggedIn()
  {
    const accessToken = accessTokenHandler.get();
    if(!accessToken)
      return false;

    await SpotifyApi.getUserProfile();
    return true;
  }

  static async login()
  {
    /* Get the code challenge and code verifier for OAuth PKCE login. */
    const pkce: { verifier: string, challenge: string, } = await new Promise(resolve =>
    {
      getPkce(43, (error, { verifier, challenge }) =>
      {
        if(error)
          throw error;

        resolve({ verifier, challenge });
      });
    });

    /* Store the code verifier in session storage temporarily
      to use for requesting an access token. */
    codeVerifierHandler.set(pkce.verifier);

    const state = (Math.random() + 1).toString(36).substring(2);
    const params: { [key: string]: string; } =
    {
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: location.href,
      state,
      code_challenge_method: 'S256',
      code_challenge: pkce.challenge,
    };

    const loginUrl = new URL(spotifyAuthorizeUrl);
    for(const param in params)
      loginUrl.searchParams.set(param, params[param]);

    location.href = loginUrl.href;
  }

  static async fetchAccessToken()
  {
    /* Retrieve then remove the code verifier from the session storage */
    const codeVerifier = codeVerifierHandler.get();
    codeVerifierHandler.clear();
    if(!codeVerifier)
      return location.href = '/';

    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if(!code || !params.get('state'))
      return;

    const postParams =
    {
      code,
      redirect_uri: `${location.origin}/login`,
      grant_type: grantType,
      client_id: clientId,
      code_verifier: codeVerifier,
    };

    const body = new URLSearchParams(postParams);
    const response = await fetch(spotifyTokenUrl, {
      method: 'POST',
      body: new URLSearchParams(body),
    });

    const data: { access_token: string, } = await response.json();
    const accessToken = data.access_token;
    accessTokenHandler.set(accessToken);
    location.href = '/';
  }

  static getAccessToken()
  {
    return accessTokenHandler.get();
  }
}

/* Handles functions for the code verifier stored in session storage. */
const codeVerifierHandler =
{
  storageKey: 'code_verifier',
  get: () => sessionStorage.getItem(codeVerifierHandler.storageKey),
  set: (verifier: string) => sessionStorage.setItem(codeVerifierHandler.storageKey, verifier),
  clear: () => sessionStorage.removeItem(codeVerifierHandler.storageKey),
};

/* Custom string encoding functions. */
const encoder =
{
  /* Encodes the given string implementing a specific algorithm. */
  encode: (string: string) =>
  {
    /* Reverse the string */
    let encoded = string.split('').reverse().join('');

    /* Base64 encode the reversed string */
    encoded = btoa(encoded);

    /* Reverse the encoded reversed string */
    encoded = encoded.split('').reverse().join('');

    /* Base64 encode the reversed encoded string */
    encoded = btoa(encoded);
    return encoded;
  },

  decode: (string: string) =>
  {
    /* Base64 decode the string */
    let decoded = atob(string);

    /* Reverse the decoded string */
    decoded = decoded.split('').reverse().join('');

    /* Base64 decode the reversed decoded string */
    decoded = atob(decoded);

    /* Reverse the decoded string */
    decoded = decoded.split('').reverse().join('');
    return decoded;
  },
};

/*
  Handles functions for the access token stored in local storage.
  The access token and its key is encoded before storing.
*/
const accessTokenHandler =
{
  storageKey: 'access_token',
  get: () =>
  {
    const encodedToken = localStorage.getItem(encoder.encode(accessTokenHandler.storageKey));
    if(encodedToken)
      return encoder.decode(encodedToken);
  },
  set: (token: string) => localStorage.setItem(
    encoder.encode(accessTokenHandler.storageKey),
    encoder.encode(token),
  ),
};
