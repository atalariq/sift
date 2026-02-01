'use client';
import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import Button from '@/components/Buttons';
// import { GoogleIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/api';

const RegisterPage = ()=> {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e)=> {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]){
      setErrors(prev=> ({ ...prev, [name]: ''}));
    }
    if(error){
      setError('');
    }
    if(name === 'password' && passwordError){
      setPasswordError('');
    }
    if(name === 'confirmPassword' && confirmPasswordError){
      setConfirmPasswordError('');
    }
  };
  const handleSubmit = async (e)=> {
    e.preventDefault();
    if (formData.password.length < 8) {
      setPasswordError("Password harus minimal 8 karakter!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Password tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      // Panggil fungsi register
      await registerUser({
        email: formData.email,
        password: formData.password,
        // Jika backend butuh username, sertakan juga:
        // name: formData.username 
      });

      alert("Registrasi Berhasil! Silakan login.");
      router.push("/auth/login"); // Arahkan ke halaman login
    } catch (err) {
      setError(err.message); // Akan muncul jika email sudah terdaftar (Error 409)
    } finally {
      setLoading(false);
    }
  };

  return(
    <AuthLayout>
      <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black  py-3 mb-3">
            Register
          </h1>
          
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* <Input
            id="username"
            name="username"
            type="text"
            label="Username"
            placeholder=""
            required
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
          /> */}
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
            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder=""
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {confirmPasswordError && (
              <p className="text-red-600 text-sm mt-1">{confirmPasswordError}</p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
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
                Registering...
              </div>
            ) : (
              'Register'
            )}
          </Button>

          {/* Divider */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div> */}

          {/* Google Sign In */}
          {/* <Button
            type="button" 
            variant="google"
            icon={<GoogleIcon />}
          >
            Sign in with Google
          </Button> */}

          {/* Register Link */}
          <div className=" text-sm text-gray-600 mt-4">
            Sudah punya akun ?{' '}
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 font-medium">
                Masuk sekarang
            </Link>
          </div>
        </form>
    </AuthLayout>
  )
}

export default RegisterPage;