import { defineStore } from 'pinia';
import { Spotify } from '../libraries/spotify';

export const useAuthStore = defineStore('auth', () => ({
  /* This user state is also the indicator for the logged in state. */
  user:
  {
    id: '',
    name: '',
    image: '',
  },

  async fetchUser()
  {
    const { id, display_name, images } = await Spotify.Api.getUserProfile();
    const newUser = {
      id,
      name: '',
      image: '',
    };

    if(display_name)
      newUser.name = display_name;

    const image = images?.shift();
    if(image)
      newUser.image = image.url;

    this.user = newUser;
  }
}));
