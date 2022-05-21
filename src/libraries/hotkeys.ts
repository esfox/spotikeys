import tinykeys from 'tinykeys';
import { QuickCommands } from './QuickCommands';

export class Hotkeys
{
  static setup()
  {
    tinykeys(window, {
      '$mod+Enter': () => QuickCommands.events.focus(),
    });
  }
}