<template>
  <Layout>
    <p>This is your dashboard. Based on your role ({{ user?.role }}), you'll see different actions here.</p>

    <!-- CSV Upload Section -->
    <div v-if="user?.role === 'admin'" class="upload-section">
      <h2>Upload CSV</h2>
      <form @submit.prevent="uploadCSV">
        <input type="file" @change="onFileChange" />
        <button type="submit" :disabled="isLoading">Upload CSV</button>
      </form>
      <div v-if="message" class="flash success">{{ message }}</div>
      <div v-if="errors.length" class="flash error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>
    </div>

    <!-- Employee List -->
    <div class="employee-list">
      <h2>Employee List</h2>
      <input
        type="text"
        v-model="searchQuery"
        @input="fetchEmployees"
        placeholder="Search by name, email, or number"
      />
      <table>
        <thead>
          <tr>
            <th @click="sort('name')">Name</th>
            <th @click="sort('email')">Email</th>
            <th @click="sort('number')">Number</th>
            <th>Designation</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.number }}</td>
            <td>{{ employee.designation }}</td>
            <td>{{ employee.address }}</td>
          </tr>
          <tr v-if="employees.length === 0">
            <td colspan="5">No employees found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="employee-list">
        <UserManagement v-if="user?.role === 'admin'" :user="user" />
    </div>
  </Layout>
</template>

<script>
import Layout from "../components/Layout.vue";
import axios from "../axios";
import UserManagement from "@/components/UserManagement.vue";

export default {
  components: { Layout,UserManagement },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      file: null,
      isLoading: false,
      message: null,
      errors: [],
      employees: [],
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
    };
  },
  created() {
    const u = localStorage.getItem('user');
    if (!u) this.$router.push('/');
    else {
      this.user = JSON.parse(u);
      this.fetchEmployees();
    }
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadCSV() {
      this.errors = [];
      this.message = null;

      if (!this.file) {
        this.errors.push('Please select a CSV file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);
      this.isLoading = true;

      try {
        const response = await axios.post('/upload-csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.message = response.data.message;
        this.errors = response.data.errors || [];
        this.fetchEmployees();
      } catch (error) {
        console.error('File upload failed:', error);
        this.errors.push('An error occurred while uploading the file.');
      } finally {
        this.isLoading = false;
      }
    },
    async fetchEmployees() {
      try {
        const response = await axios.get('/employees', {
          params: {
            search: this.searchQuery,
            sort_by: this.sortBy,
            order: this.sortOrder,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.employees = response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    },
    sort(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
      this.fetchEmployees();
    },
  },
};
</script>

<style scoped>
.upload-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.upload-section h2 {
  margin-bottom: 15px;
}

.upload-section input[type="file"] {
  margin-bottom: 10px;
}

.upload-section button {
  padding: 8px 16px;
  background-color: #3b82f6; /* blue-500 */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.upload-section button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.flash {
  margin-top: 10px;
  padding: 10px;
  border-radius: 6px;
}

.flash.success {
  background-color: #d1fae5;
  color: #065f46;
}

.flash.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.employee-list h2 {
  margin-bottom: 10px;
}

.employee-list input[type="text"] {
  padding: 8px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background-color: #f1f5f9;
}

th, td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

th {
  cursor: pointer;
  user-select: none;
}

tr:hover {
  background-color: #f9fafb;
}
</style>
