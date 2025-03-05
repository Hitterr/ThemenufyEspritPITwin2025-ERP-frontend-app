import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
import { getDeviceInfo } from "../utils/deviceInfo";

export const authStore = create(
  persist(
    devtools(
      (set) => ({
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
          userdata.deviceId = getDeviceInfo();
          const res = await apiRequest.post("/auth/login/email", userdata);
          set(
            produce((state) => {
              if (res.data.data) state.currentUser = res.data.data;
            })
          );
        },
        verifyDevice: (userData) => {
          localStorage.setItem("token", userData.token);
          set(
            produce((state) => {
              state.currentUser = userData;
            })
          );
        },
        signup: async () => {},
        logout: async () => {
          localStorage.removeItem("token");
          set(
            produce((state) => {
              state.currentUser = null;
            })
          );
        },
        googleLogin: async (tokenId) => {
          const deviceId = getDeviceInfo();
          console.log("📢 [authStore.js:72]", tokenId);
          const res = await apiRequest.post("/auth/login/google", {
            tokenId,
            deviceId,
          });
          console.log("📢 [authStore.js:74]", res);
          set(
            produce((state) => {
              state.currentUser = res.data.data;
            })
          );
        },
        loginFacebook: async (accessToken) => {
          const deviceId = getDeviceInfo();
          console.log("📢 [authStore.js:72]", accessToken);
          const res = await apiRequest.post("/auth/login/facebook", {
            accessToken,
            deviceId,
          });
          console.log("📢 [authStore.js:74]", res);
          set(
            produce((state) => {
              state.currentUser = res.data.data;
            })
          );
        },
        getProfile: async (token) => {
          try {
            const res = await apiRequest.get(`/auth/login/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(
              "🔍 ~ devtools() callback ~ src/jsx/store/authStore.js:101 ~ res:",
              res.data
            );
            return res.data.data;
          } catch (error) {
            console.error("Device verification check failed:", error);
            return false;
          }
        },
      }),
      {
        name: "auth-storage", // unique name for localStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentUser: state.currentUser,
          // Add other states you want to persist
        }),
      }
    )
  )
);
