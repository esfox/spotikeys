import { SpotifyAuth } from './auth';

export class SpotifyPlayback
{
  static init()
  {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () =>
    {
      let accessToken!: string;
      try
      {
        accessToken = SpotifyAuth.getAccessToken() as string;
      }
      catch(error)
      {
        console.error(error);
      }

      if(!accessToken)
        return;

      const player = new window.Spotify.Player({
        name: 'Spotikeys',
        getOAuthToken: callback => callback(accessToken),
        volume: 0.1,
      });

      player.addListener('ready', ({ device_id }) => console.log(device_id));
      player.addListener('authentication_error', ({ message }) => console.error(message));
      player.connect();
    };
  }
}
