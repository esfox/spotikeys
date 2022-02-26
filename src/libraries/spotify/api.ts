import SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyAuth } from './auth';

const api = new SpotifyWebApi();
const accessToken = SpotifyAuth.getAccessToken();
if(accessToken)
  api.setAccessToken(accessToken);

export class SpotifyApi
{
  static isPlaying: boolean;

  static setToken(token: string)
  {
    if(!accessToken)
      api.setAccessToken(token);
  }

  static async getIsPlaying()
  {
    if(SpotifyApi.isPlaying === undefined)
    {
      try
      {
        const playbackState = await api.getMyCurrentPlaybackState();
        SpotifyApi.isPlaying = playbackState.is_playing;
      }
      catch(error)
      {
        console.error(error);
      }
    }

    return SpotifyApi.isPlaying;
  }

  static async play()
  {
    const isPlaying = await SpotifyApi.getIsPlaying();
    if(isPlaying)
      return;

    let startOnNewDevice = false;
    try
    {
      await api.play();
      SpotifyApi.isPlaying = !SpotifyApi.isPlaying;
    }
    catch(error: any)
    {
      if(error.status !== 404)
        return console.error(error);

      startOnNewDevice = true;
    }

    if(!startOnNewDevice)
      return;

    try
    {
      const { devices } = await api.getMyDevices();
      const deviceId = devices.pop()?.id;
      if(!deviceId)
        return;

      await api.transferMyPlayback([deviceId], { play: true });
      SpotifyApi.isPlaying = !SpotifyApi.isPlaying;
    }
    catch(error)
    {
      return console.error(error);
    }
  }

  static async pause()
  {
    const isPlaying = await SpotifyApi.getIsPlaying();
    if(!isPlaying)
      return;

    try
    {
      await api.pause();
      SpotifyApi.isPlaying = !SpotifyApi.isPlaying;
    }
    catch(error)
    {
      console.error(error);
    }
  }

  static async togglePlayback()
  {
    const isPlaying = await SpotifyApi.getIsPlaying();
    if(isPlaying)
      SpotifyApi.pause();
    else
      SpotifyApi.play();
  }

  static async getDevices()
  {
    return api.getMyDevices();
  }
}
