<template>
  <div class="mt-10">
    <h2 class="text-lg font-semibold mb-4">User Management</h2>

    <!-- Add User Form (Admins only) -->
    <div v-if="isAdmin" class="mb-6 border p-4 rounded bg-white shadow-md">
      <h3 class="font-semibold mb-2 text-gray-700">Add User</h3>
      <form @submit.prevent="addUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.name" type="text" placeholder="Name" class="input-field" required />
        <input v-model="form.email" type="email" placeholder="Email" class="input-field" required />
        <select v-model="form.role" class="input-field" required>
          <option disabled value="">Select Role</option>
          <option value="user">User</option>
        </select>
        <input v-model="form.password" type="password" placeholder="Password" class="input-field" required />
        <button class="submit-btn col-span-full mt-2">Add User</button>
      </form>
      <!-- Error Message for Add User -->
      <div v-if="addUserError" class="mt-2 text-red-500 text-sm">
        {{ addUserError }}
      </div>
    </div>

    <!-- User Table -->
    <table class="user-table">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Role</th>
          <th class="px-4 py-2" v-if="isAdmin">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id" class="border-t">
          <td class="px-4 py-2">
            <input v-model="user.name" :readonly="!isAdmin" class="border p-1 w-full rounded" />
          </td>
          <td class="px-4 py-2">
            <input v-model="user.email" :readonly="!isAdmin" class="border p-1 w-full rounded" />
          </td>
          <td class="px-4 py-2">
            <select v-model="user.role" :disabled="!isAdmin" class="border p-1 rounded w-full">
              <option value="user">User</option>
            </select>
          </td>
          <td class="px-4 py-2" v-if="isAdmin">
            <button @click="updateUser(user)" class="action-btn mr-2">Update</button>
            <button @click="deleteUser(user.id)" class="action-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Error Message for Table Actions -->
    <div v-if="tableActionError" class="mt-4 text-red-500 text-sm">
      {{ tableActionError }}
    </div>
  </div>
</template>

<script>
import axiosClient from '../axios';

export default {
  name: "UserManagement",
  props: {
    user: Object,
  },
  data() {
    return {
      users: [],
      form: {
        name: "",
        email: "",
        role: "",
        password: "",
      },
      addUserError: "",
      tableActionError: "",
    };
  },
  computed: {
    isAdmin() {
      return this.user?.role === "admin";
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await axiosClient.get("/users");
        this.users = res.data;
      } catch (error) {
        console.error("Fetch users failed:", error);
        this.tableActionError = "Failed to load users. Please try again later.";
      }
    },
    async addUser() {
      this.addUserError = "";
      try {
        await axiosClient.post("/users", this.form);
        this.form = { name: "", email: "", role: "", password: "" };
        this.fetchUsers();
      } catch (error) {
        console.error("Add user failed:", error.response?.data || error.message);
        this.addUserError = "Failed to add user. Please check the data and try again.";
      }
    },
    async updateUser(user) {
      this.tableActionError = "";
      try {
        await axiosClient.put(`/users/${user.id}`, {
          name: user.name,
          email: user.email,
          role: user.role,
        });
        this.fetchUsers();
      } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        this.tableActionError = "Failed to update user. Please try again.";
      }
    },
    async deleteUser(id) {
      if (!confirm("Are you sure you want to delete this user?")) return;
      this.tableActionError = "";
      try {
        await axiosClient.delete(`/users/${id}`);
        this.fetchUsers();
      } catch (error) {
        console.error("Delete failed:", error.response?.data || error.message);
        this.tableActionError = "Failed to delete user. Please try again.";
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
/* Table styling */
.user-table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 16px;
}

.user-table th, .user-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.user-table th {
  background-color: #f9fafb;
  font-weight: 600;
}

.user-table td {
  background-color: #ffffff;
}

/* Styling form elements */
.input-field {
  font-size: 14px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #45a049;
}

.action-btn {
  background-color: #3498db;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background-color: #2980b9;
}

/* Form container styling */
form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

form input,
form select,
form button {
  width: 100%;
}

/* Error message styling */
.text-red-500 {
  color: red;
}

/* Responsive layout */
@media (max-width: 768px) {
  form {
    grid-template-columns: 1fr;
  }
}
</style>
