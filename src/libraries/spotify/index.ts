import { SpotifyApi } from './api';
import { SpotifyAuth } from './auth';
import { SpotifyPlayback } from './playback';

export class Spotify
{
  static Api = SpotifyApi;
  static Auth = SpotifyAuth;
  static Playback = SpotifyPlayback;
}
