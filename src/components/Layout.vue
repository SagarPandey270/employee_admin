<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <h2>MyApp</h2>
      <ul>
        <li class="nav-item">Dashboard</li>
        <li class="nav-item" v-if="user?.role === 'admin'">User Management</li>
        <li class="nav-item">Employees</li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-left">
          <h1>Dashboard</h1>
          <p>Welcome, {{ user?.name }} ({{ user?.role }})</p>
        </div>
        <div class="topbar-right">
          <button class="logout-button" @click="logout">Logout</button>
        </div>
      </div>

      <!-- Page Content Slot -->
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
  methods: {
    async logout() {
      try {
        await axios.post('/logout');
      } catch (error) {
        console.error('Logout failed', error);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f6f8;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
}
.sidebar h2 {
  margin-bottom: 30px;
  font-size: 24px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar .nav-item {
  margin: 18px 0;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 6px;
  transition: background 0.3s;
}
.sidebar .nav-item:hover {
  background-color: #34495e;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* Topbar */
.topbar {
  background-color: #fff;
  padding: 15px 25px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topbar-left h1 {
  margin: 0;
  font-size: 22px;
}
.topbar-left p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #555;
}
.logout-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.logout-button:hover {
  background-color: #c0392b;
}

/* Content Slot Area */
.content {
  flex-grow: 1;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}
</style>
