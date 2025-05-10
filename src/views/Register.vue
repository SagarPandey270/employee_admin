<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 class="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Your Account</h2>
            <form @submit.prevent="register" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="name"
                        v-model="name"
                        type="text"
                        placeholder="Enter your full name"
                        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder="Enter your email"
                        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="Enter your password"
                        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        id="role"
                        v-model="role"
                        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option disabled value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <button
                    type="submit"
                    class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300"
                >
                    Register
                </button>
            </form>
            <p class="text-sm mt-4 text-center text-gray-600">
                Already have an account?
                <router-link to="/" class="text-blue-500 hover:underline">Login</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import axios from '../axios';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            role: 'user',
        };
    },
    methods: {
        async register() {
            try {
                await axios.post('/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    role: this.role,
                });
                this.$router.push('/');
            } catch (err) {
                alert(err.response?.data?.message || 'Registration failed');
            }
        },
    },
};
</script>

<style scoped>
body {
    font-family: 'Inter', sans-serif;
}
</style>
