'use client';
import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import Button from '@/components/Buttons';
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/api";


const LoginPage = () => {
  
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({ 
        email: formData.email, 
        password: formData.password 
      });
      
      console.log("Respon dari Backend:", response); // LIHAT DI CONSOLE (F12)

      // Pastikan mengambil nama field yang benar (misal: token, accessToken, atau data.token)
      const token = response.token || response.accessToken || (response.data && response.data.token);

      if (token) {
        localStorage.setItem("token", token);
        
        // Ambil username dari berbagai kemungkinan struktur response
        const username = response.user?.name || response.user?.username || response.name || response.username || formData.email.split('@')[0];
        localStorage.setItem("userName", username);
        
        router.push("/dashboard");
      } else {
        setError("Token tidak ditemukan dalam respon server!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black  py-3 mb-3">
            Selamat Datang
          </h1>
          <p className="text-sm text-gray-600">
            Silakan masuk untuk melakukan pengelolaan kandidat anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail"
            placeholder=""
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              label="password"
              placeholder=""
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center rounded-lg">{error}</div>
          )}

          {/* Login Button */}
          <Button
            type="submit" variant="auth"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </Button>



          {/* Register Link */}
          <div className=" text-sm text-gray-600 mt-4">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-blue-500 hover:text-blue-600 font-medium">
              daftar sekarang
            </Link>
          </div>
        </form>
      
    </AuthLayout>
  )
}

export default LoginPage;