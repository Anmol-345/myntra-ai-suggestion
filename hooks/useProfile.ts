import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ProfileStore {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

export const useProfile = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
        address: '123 Myntra Street, Fashion City, 560001',
      },
      updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
    }),
    { name: 'profile-storage' }
  )
);
