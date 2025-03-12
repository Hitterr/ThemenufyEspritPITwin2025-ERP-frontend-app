import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const useResetPassStore = create(
  persist(
    devtools(
      (set) => ({
        email: "",
        verificationCode: "", 
        password: "",
        confirmPassword: "",
        goSteps: 0,

        setEmail: (email) =>
          set(
            produce((state) => {
              state.email = email;
            })
          ),
        setVerificationCode: (verificationCode) =>
          set(
            produce((state) => {
              state.verificationCode = verificationCode;
            })
          ),
        setPassword: (password) =>
          set(
            produce((state) => {
              state.password = password;
            })
          ),
        setConfirmPassword: (confirmPassword) =>
          set(
            produce((state) => {
              state.confirmPassword = confirmPassword;
            })
          ),
        setGoSteps: (goSteps) =>
          set(
            produce((state) => {
              state.goSteps = goSteps;
            })
          ),

        resetState: () =>
          set(
            produce((state) => {
              state.email = "";
              state.verificationCode = "";
              state.password = "";
              state.confirmPassword = "";
              state.goSteps = 0;
            })
          ),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          email: state.email,
          verificationCode: state.verificationCode,
          password: state.password,
          confirmPassword: state.confirmPassword,
          goSteps: state.goSteps,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
)