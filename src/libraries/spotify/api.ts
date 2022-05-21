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
catch(error)
{
  console.error(error);
}

export class SpotifyApi
{
  static getUserProfile = () => api.getMe();

  static setToken = async (token: string) =>
  {
    if(!accessToken)
      api.setAccessToken(token);
  }

  static play = async () => playWithNewActiveDevice(api.play);

  static pause = async () => await api.pause();

  static previous = () => playWithNewActiveDevice(api.skipToPrevious, true);

  static next = async () => playWithNewActiveDevice(api.skipToNext, true);

  static getDevices = async () => api.getMyDevices();

  static getPlaylists = async ({
    userId,
    limit,
    offset,
  }: {
    userId?: string,
    limit?: number,
    offset?: number,
  } = { limit: 10 }) =>
  {
    const params: { limit?: number, offset?: number } = {}
    if(limit)
      params.limit = limit;
    if(offset)
      params.offset = offset;

    return api.getUserPlaylists(userId, params);
  };
}

/* This executes the given function call, but does
  also sets a new active device if there is none. */
async function playWithNewActiveDevice(playbackCall: Function, transferPlaybackOnly?: boolean)
{
  let startOnNewDevice = false;
  try
  {
    await playbackCall();
  }
  catch(error: any)
  {
    if(error.status === 404)
      startOnNewDevice = true;
    else
      throw error;
  }

  if(!startOnNewDevice)
    return;

  const { devices } = await api.getMyDevices();
  const deviceId = devices.pop()?.id;
  if(!deviceId)
    return;

  await api.transferMyPlayback([deviceId], { play: !transferPlaybackOnly });
  if(!transferPlaybackOnly)
    await playbackCall();
}
