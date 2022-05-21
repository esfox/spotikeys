import { useAuthStore } from './auth';

export function useStore()
{
  const auth = useAuthStore();
  return {
    auth,
  }
}
