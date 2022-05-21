import { Spotify } from './spotify';

const eventNames =
{
  focus: 'qc:focus',
};

const events =
{
  focus:
  {
    name: eventNames.focus,
    event: new Event(eventNames.focus),
  },
};

export class QuickCommands
{
  static events =
    {
      focus: () => document.dispatchEvent(events.focus.event),
      onFocus: (handler: () => void) => document.addEventListener(events.focus.name, handler),
    }

  static commands = [
    {
      name: 'play',
      label: 'Start/Resume Playback',
      run: Spotify.Api.play,
    },
    {
      name: 'pause',
      label: 'Pause Playback',
      run: Spotify.Api.pause,
    },
  ]
}
