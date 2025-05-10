<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Welcome Back</h2>
      <form @submit.prevent="login" class="login-form">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="input-field"
          />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="input-field"
          />
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>
        <div>
          <button type="submit" class="submit-btn">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: {},
    };
  },
  methods: {
    async login() {
      this.errors = {}; // Reset errors
      try {
        const res = await axios.post('/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.$router.push('/dashboard');
      } catch (err) {
        if (err.response?.data?.errors) {
          this.errors = err.response.data.errors;
        } else if (err.response?.data?.message) {
          this.errors = { email: err.response.data.message }; // Show general message under email
        } else {
          this.errors = { email: 'Login failed. Please try again.' };
        }
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #3b82f6, #14b8a6);
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  color: #1d4ed8;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s ease;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
}

.submit-btn {
  width: 100%;
  background: #2563eb;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #1d4ed8;
}

.register-text {
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
  color: #6b7280;
}

.register-link {
  color: #2563eb;
  font-weight: 500;
  margin-left: 0.25rem;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
