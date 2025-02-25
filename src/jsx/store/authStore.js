import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export const authStore = create(
  devtools(
    persist((set) => ({
      currentUser: {
        firstName: "Hadil",
        lastName: "Bouhachem",
        // role: "admin",
        email: "hadil.bouhachem@example.com",
        phone: "12345678",
        address: "2036 Soukra",
        employee: {
          salary: 2500,
        },
        restaurant: {
          name: "Restaurant #1",
        },
        image: "images/avatar/1.jpg",
      },
      profile: {
        tab: "About",
      },
      setActiveTab: (tab) => {
        set(
          produce((state) => {
            state.profile.tab = tab;
          })
        );
      },
      updateCurrentUser: (userName) => {
        set(
          produce((state) => {
            state.currentUser.name = userName;
          })
        );
      },
      updateProfile: (userData) => {
        set(
          produce((state) => {
            state.currentUser = {
              ...state.currentUser,
              ...userData,
              employee: {
                ...state.currentUser.employee,
                ...userData.employee,
              },
              restaurant: {
                ...state.currentUser.restaurant,
                ...userData.restaurant,
              },
            };
          })
        );
      },

      login: async (userdata) => {
        set(
          produce((state) => {
            state.currentUser = userdata;
          })
        );
      },
      signup: async () => {},
      logout: async () => {},
    }))
  )
);
