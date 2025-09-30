/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import Image from 'next/image';
import { type JSX, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

// ---------------------------
// Types
// ---------------------------
interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface FormField {
  name: keyof FormData;
  type: string;
  placeholder: string;
  icon: string;
  alt: string;
  iconWidth: number;
  iconHeight: number;
}

interface ApiResponse {
  message: string;
  success: boolean;
  status_code: number;
  data?: {
    user: {
      id: number;
      name: string;
      phone: string;
      email: string;
      is_active: boolean;
      profile_image: string | null;
      created_at: string;
      modified_at: string;
      is_deleted: boolean;
      deleted_at: string | null;
    };
  };
}

interface ApiError {
  message: string;
  success: false;
  status_code: number;
}

// ---------------------------
// Constants
// ---------------------------
const FORM_FIELDS: FormField[] = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Full Name',
    icon: '/images/common/user.svg',
    alt: 'User',
    iconWidth: 16,
    iconHeight: 16,
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email Address',
    icon: '/images/common/email.svg',
    alt: 'Email',
    iconWidth: 18,
    iconHeight: 18,
  },
  {
    name: 'phone',
    type: 'tel',
    placeholder: 'Phone Number (10 digits)',
    icon: '/images/common/password.svg',
    alt: 'Phone',
    iconWidth: 18,
    iconHeight: 18,
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    icon: '/images/common/password.svg',
    alt: 'Password',
    iconWidth: 20,
    iconHeight: 20,
  },
];

// const SOCIAL_PROVIDERS = [
//   { name: 'facebook', icon: '/images/common/facebook.svg', alt: 'Facebook' },
//   { name: 'google', icon: '/images/common/google.svg', alt: 'Google' },
//   { name: 'apple', icon: '/images/common/apple.svg', alt: 'Apple' },
// ];

// ---------------------------
// Component
// ---------------------------
export default function SignupPage(): JSX.Element {
  // ---------------------------
  // State
  // ---------------------------
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------
  // Validation Helpers
  // ---------------------------
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.trim())) return 'Phone number must be exactly 10 digits';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password.length > 128) return 'Password must be less than 128 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) return 'Password must contain at least one special character';
    return undefined;
  };

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'password':
        return validatePassword(value);
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof FormData, value);
      if (error) newErrors[key as keyof FormData] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // Event Handlers
  // ---------------------------
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let processedValue = value;

      // Only digits for phone
      if (name === 'phone') {
        processedValue = value.replace(/\D/g, '').slice(0, 10);
      }

      // Only letters & spaces for name
      if (name === 'name') {
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
      }

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));

      // Clear error when user edits field
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ---------------------------
  // Submit
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Get API URL from environment variables
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_AUTH_URL;
      if (!apiUrl) throw new Error('API URL is not configured');

      // Make API call to register user
      const response = await fetch(`${apiUrl}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse | ApiError = await response.json();

      // 🔴 Error case
      if (!response.ok || !data.success || data.status_code !== 200) {
        const errorMessage =
          'message' in data && data.message ? data.message : 'Registration failed. Please try again.';

        toast.error(errorMessage);
        return; // Prevent redirect
      }

      // ✅ Success
      toast.success('Account created successfully!');
      window.location.replace('/auth/login');
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------
  // Social Login
  // ---------------------------
  // const handleSocialLogin = useCallback((provider: string) => {
  //   toast.info(`Login with ${provider}`);
  //   // TODO: Implement social login integration
  // }, []);

  // ---------------------------
  // Helper to build input classes
  // ---------------------------
  const getInputClassName = (fieldName: keyof FormData): string => {
    const baseClasses = 'flex rounded-xl border-2 py-3.5 px-2.5 transition-colors items-center gap-2.5';
    const errorClasses = 'border-red-500 focus:border-red-500';
    const normalClasses = 'border-[#51bcd0] focus:border-[#49a9bb]';

    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses}`;
  };

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#51bcd0] to-[#3ba8c7] px-5 py-5 lg:py-0'>
      <div className='mx-auto grid w-full max-w-6xl items-center lg:grid-cols-2'>
        {/* Left side - Image */}
        <div className='order-2 hidden justify-end lg:order-1 lg:flex'>
          <div className='relative mr-[-40px] h-screen w-[638px]'>
            <Image
              src='/images/common/signup.png'
              alt='Happy woman with laptop celebrating'
              className='pt-[25px] xl:pt-[100px]'
              fill
              priority
            />
          </div>
        </div>

        {/* Right side - Form */}
        <div className='order-1 px-4 xl:order-2 xl:px-0'>
          <div className='mx-auto max-w-xl rounded-2xl bg-white p-4 shadow-xl xl:p-8'>
            {/* Header */}
            <div className='my-4 px-4 text-center xl:my-8 xl:px-8'>
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
              <h1 className='mb-2 text-xl font-bold text-[#51bcd0] lg:text-2xl'>Create new account</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='mx-auto w-[90%] space-y-[25px] md:w-full md:px-8'>
              {/* Form Fields */}
              {FORM_FIELDS.map((field) => (
                <div key={field.name}>
                  <div className={getInputClassName(field.name)}>
                    <Image src={field.icon} alt={field.alt} width={field.iconWidth} height={field.iconHeight} />

                    <input
                      type={field.name === 'password' ? (showPassword ? 'text' : 'password') : field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className='w-full text-xs focus:outline-none lg:text-base'
                      disabled={isSubmitting}
                      autoComplete={field.name === 'phone' ? 'tel' : field.name}
                    />

                    {/* Password visibility toggle */}
                    {field.name === 'password' && (
                      <button
                        type='button'
                        onClick={togglePasswordVisibility}
                        className='flex-shrink-0 cursor-pointer p-1 text-gray-500 transition-colors hover:text-gray-700'
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                  {errors[field.name] && (
                    <p className='absolute mt-0.5 ml-1 text-xs text-red-600'>{errors[field.name]}</p>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-brand-primary hover:bg-brand-primary-dark shadow-custom-3d-sm mt-3 w-full cursor-pointer rounded-full border border-black px-5 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 xl:mt-6'
              >
                {isSubmitting ? 'Creating Account...' : 'Sign up'}
              </button>
            </form>

            {/* Social Login */}
            {/* <div className='mt-8'>
              <p className='text-center text-gray-600'>Sign in With</p>
              <div className='flex justify-center gap-4'>
                {SOCIAL_PROVIDERS.map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleSocialLogin(provider.name)}
                    className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-50'
                    disabled={isSubmitting}
                  >
                    <Image src={provider.icon} alt={provider.alt} width={24} height={24} />
                  </button>
                ))}
              </div>
            </div> */}

            {/* Login Link */}
            <div className='mt-4 text-center xl:my-8'>
              <p className='text-sm text-gray-600'>
                Already member?{' '}
                <a href='/auth/login' className='font-semibold text-[#51bcd0] transition-colors hover:text-[#49a9bb]'>
                  Log in
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
