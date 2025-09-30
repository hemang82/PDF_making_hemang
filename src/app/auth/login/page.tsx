/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import Image from 'next/image';
import { type JSX, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { setTokens } from '@/utils/auth';

// ---------------------------
// Types
// ---------------------------
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface ApiSuccess {
  message: string;
  success: true;
  status_code: 200;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: 'bearer';
  };
}

interface ApiError {
  message: string;
  success: false;
  status_code: number;
}

// ---------------------------
// Validation helpers
// (reuse from signup if exported)
// ---------------------------
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Enter a valid email address';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return undefined; // Password strength already enforced at signup
};

// ---------------------------
// Component
// ---------------------------
export default function LoginPage(): JSX.Element {
  // ---------------------------
  // State
  // ---------------------------
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------
  // Helpers
  // ---------------------------
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const getInputClassName = (field: keyof FormData): string =>
    `flex rounded-xl border-2 py-3.5 px-2.5 transition-colors items-center gap-2.5 ${
      errors[field] ? 'border-red-500 focus:border-red-500' : 'border-[#51bcd0] focus:border-[#49a9bb]'
    }`;

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_AUTH_URL;
      if (!apiUrl) throw new Error('API URL missing');

      const res = await fetch(`${apiUrl}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: ApiSuccess | ApiError = await res.json();

      if (!res.ok || !data.success || data.status_code !== 200) {
        throw new Error('message' in data ? data.message : 'Login failed');
      }

      // ✅ Save tokens in localStorage
      const { access_token, refresh_token } = data.data;
      setTokens(access_token, refresh_token);

      toast.success('Welcome back!');
      window.location.replace('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSocialLogin = (provider: string) => {
  //   toast.info(`Login with ${provider}`);
  //   // TODO: implement provider flow (next-auth or your custom route)
  // };

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#51bcd0] to-[#3ba8c7] px-5 py-5 lg:py-0'>
      <div className='mx-auto grid w-full max-w-6xl items-center lg:grid-cols-2'>
        {/* Left – illustration */}
        <div className='order-2 hidden justify-end lg:order-1 lg:flex'>
          <div className='relative mr-[-30px] h-screen w-[552px]'>
            <Image
              src='/images/common/login.png'
              alt='Happy woman with laptop celebrating'
              className='pt-[25px] xl:pt-[100px]'
              fill
              priority
            />
          </div>
        </div>

        {/* Right – form */}
        <div className='order-1 px-4 lg:order-2 lg:px-0'>
          <div className='mx-auto max-w-xl rounded-2xl bg-white p-4 shadow-xl lg:p-8'>
            <div className='my-8 px-8 text-center'>
              <div className='mb-4 flex items-center justify-center gap-2'>
                <a href='/' aria-label='PDF Making home'>
                  <Image
                    priority
                    src='/pdfmaking-logo.svg'
                    alt='PDFMaking logo'
                    width={210}
                    height={45}
                    className='h-auto w-auto'
                  />
                </a>
              </div>
              <h1 className='mb-2 text-xl font-bold text-[#51bcd0] lg:text-2xl'>Login to your account</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='mx-auto w-[90%] space-y-[25px] md:w-full md:px-8'>
              {/* Email */}
              <div>
                <div className={getInputClassName('email')}>
                  <Image src='/images/common/email.svg' alt='Email' width={18} height={18} />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Email address'
                    className='w-full text-xs focus:outline-none lg:text-base'
                    disabled={isSubmitting}
                    autoComplete='email'
                  />
                </div>
                {errors.email && <p className='mt-0.5 ml-1 text-xs text-red-600'>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className={getInputClassName('password')}>
                  <Image src='/images/common/password.svg' alt='Password' width={20} height={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Password'
                    className='w-full text-xs focus:outline-none lg:text-base'
                    disabled={isSubmitting}
                    autoComplete='current-password'
                  />

                  {/* Password visibility toggle */}
                  <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className='flex-shrink-0 cursor-pointer p-1 text-gray-500 transition-colors hover:text-gray-700'
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className='mt-0.5 ml-1 text-xs text-red-600'>{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-brand-primary hover:bg-brand-primary-dark shadow-custom-3d-sm mt-6 w-full cursor-pointer rounded-full border border-black px-5 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            {/* <div className='mt-8'>
              <p className='text-center text-gray-600'>Sign in With</p>
              <div className='flex justify-center gap-4'>
                {['facebook', 'google', 'apple'].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSocialLogin(p)}
                    className='flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-gray-50'
                    disabled={isSubmitting}
                  >
                    <Image src={`/images/common/${p}.svg`} alt={p} width={24} height={24} />
                  </button>
                ))}
              </div>
            </div> */}

            <div className='my-8 text-center'>
              <p className='text-sm text-gray-600'>
                Don&rsquo;t have an account?{' '}
                <a href='/auth/signup' className='font-semibold text-[#51bcd0] transition-colors hover:text-[#49a9bb]'>
                  Create one
                </a>{' '}
                or{' '}
                <a href='/' className='font-semibold text-[#51bcd0] transition-colors hover:text-[#49a9bb]'>
                  Go to Home Page
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
