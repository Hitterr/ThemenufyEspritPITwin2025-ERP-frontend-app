import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/superadmins";

const useAdminStore = create((set) => ({
  admins: [],

  fetchAdmins: async () => {
    try {
      const response = await axios.get(API_URL);
      set({ admins: response.data.data }); // Mise à jour des admins
    } catch (error) {
      console.error("Erreur lors de la récupération des administrateurs :", error);
    }
  },

  // Add a new admin to the store
  addAdmin: (admin) => set((state) => ({ admins: [...state.admins, admin] })),

  // Edit an existing admin
  editAdmin: (updatedAdmin) =>
    set((state) => ({
      admins: state.admins.map((admin) =>
        admin._id === updatedAdmin._id ? updatedAdmin : admin
      ),
    })),
    archiveAdmin: async (id) => {
      try {
        console.log(`🔄 Archiving admin with ID: ${id}`);
    
        const response = await axios.patch(`${API_URL}/${id}/archive`, {}, { withCredentials: true });
    
        console.log("✅ Archive response:", response.data);
    
        // 🔄 Récupérer l'état actuel avant de le modifier
        set((state) => {
          const updatedAdmins = state.admins.map((admin) =>
            admin._id === id ? { ...admin, archived: true } : admin
          );
    
          console.log("🆕 Nouvel état admins après update:", updatedAdmins);
    
          return { admins: updatedAdmins };
        });
    
      } catch (error) {
        console.error("❌ Erreur lors de l'archivage :", error.response?.data || error.message);
      }
    },
    
    deleteArchivedAdmin: async (id) => {
      try {
        console.log(`Suppression de l'admin ID: ${id}`);
    
        const response = await axios.delete(`${API_URL}/${id}/delete`);
        console.log(" Delete Response:", response.data);
    
        // Mise à jour du state sans recharger tous les admins
        set((state) => ({
          admins: state.admins.filter(admin => admin._id !== id),
        }));
    
      } catch (error) {
        console.error(" Erreur lors de la suppression :", error.response?.data || error.message);
      }
    },
    
}));

export default useAdminStore;
