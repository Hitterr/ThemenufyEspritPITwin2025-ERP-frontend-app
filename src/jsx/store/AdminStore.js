import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
localStorage.removeItem('admin-storage-v2');

const useAdminStore = create(
  devtools(
    persist(
      (set, get) => ({
        admins: [
          {
            id: "1",
            name: "Kenzo Kenzo",
            email: "Kenzo@example.com",
            phone: "12345 67890", 
            blocked: false,
            status: "Verified",
          },
          {
            id: "2",
            name: "Nour nour",
            email: "nour@example.com",
            phone: "09876 54321",
            blocked: true,
            status: "Pending",
          },
          {
            id: "3",
            name: "AAAA nour",
            email: "AAAA@example.com",
            phone: "09876 54321", // Modifié de mobile à phone
            blocked: true,
            status: "Unverified",
          },  {
            id: "4",
            name: "AAAA nour",
            email: "AAAA@example.com",
            phone: "09876 54321", // Modifié de mobile à phone
            blocked: true,
            status: "Unverified",
          },  {
            id: "6",
            name: "AAAA nour",
            email: "AAAA@example.com",
            phone: "09876 54321", // Modifié de mobile à phone
            blocked: true,
            status: "Unverified",
          },  {
            id: "7",
            name: "AAAA nour",
            email: "AAAA@example.com",
            phone: "09876 54321", // Modifié de mobile à phone
            blocked: true,
            status: "Unverified",
          },
        ],

        addAdmin: (newAdmin) => {
          const existingAdmin = get().admins.find(
            (admin) => admin.email === newAdmin.email
          );
          if (!existingAdmin) {
            set((state) => ({
              admins: [...state.admins, newAdmin],
            }));
          }
        },

        editAdmin: (updatedAdmin) =>
          set((state) => ({
            admins: state.admins.map((admin) =>
              admin.id === updatedAdmin.id ? updatedAdmin : admin
            ),
          })),

        deleteAdmin: (id) =>
          set((state) => ({
            admins: state.admins.filter((admin) => admin.id !== id),
          })),

        toggleBlock: (id) =>
          set((state) => ({
            admins: state.admins.map((admin) =>
              admin.id === id
                ? {
                    ...admin,
                    blocked: !admin.blocked,
                    status: admin.blocked ? "Verified" : "Blocked",
                  }
                : admin
            ),
          })),
      }),
      {
        name: "admin-storage-v2", // Clé du Local Storage (Change-la pour tester)
        version: 1, // Utilisation de version pour éviter les conflits
        // Réinitialisation propre en cas de problème avec `persist`
        migrate: (persistedState, version) => {
          if (version === 1) {
            return { ...persistedState, version: 1 };
          }
          return persistedState;
        },
      }
    )
  )
);

export default useAdminStore;
