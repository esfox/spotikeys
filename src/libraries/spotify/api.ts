import SpotifyWebApi from 'spotify-web-api-js';
import { SpotifyAuth } from './auth';

const api = new SpotifyWebApi();
let accessToken: string | undefined;
try
{
  accessToken = SpotifyAuth.getAccessToken();
  if(accessToken)
    api.setAccessToken(accessToken);
}
catch(error) { }

export class SpotifyApi
{
  static isPlaying: boolean;

  static setToken(token: string)
  {
    if(!accessToken)
      api.setAccessToken(token);
  }

  static async getIsPlaying(throwError?: boolean)
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
        if(throwError)
          throw error;

        handleError(error);
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
        return handleError(error);

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
      handleError(error);
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
      handleError(error);
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

function handleError(error: any)
{
  if(error.status === 401)
    location.href = '/login';
  else
    console.error(error);
}
