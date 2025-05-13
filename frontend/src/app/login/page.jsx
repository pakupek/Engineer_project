'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (errors[e.target.name]) {
          setErrors({
            ...errors,
            [e.target.name]: null
          });
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccess('');
    
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
        
            const data = await response.json();

            // Zapisz tokeny tylko po udanym logowaniu
            if (data.access && data.refresh) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
            }
        
            if (!response.ok) {
                setErrors(data);
                return;
            }
        
            router.push('/home');
            } catch (error) {
                setErrors({ non_field_errors: 'Problem z połączeniem do serwera' });
            }
      
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Zaloguj się do swojego konta
                </h2>
                </div>
                
                {errors.non_field_errors && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {errors.non_field_errors}
                </div>
                )}
        
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                    <label htmlFor="username" className="sr-only">Nazwa użytkownika</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                        placeholder="Nazwa użytkownika"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                    </div>
                    <div>
                    <label htmlFor="password" className="sr-only">Hasło</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                        placeholder="Hasło"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                </div>
        
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Zapamiętaj mnie
                    </label>
                    </div>
        
                    <div className="text-sm">
                    <Link href="/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Zapomniałeś hasła?
                    </Link>
                    </div>
                </div>
        
                <div>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                    {isSubmitting ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logowanie...
                        </>
                    ) : 'Zaloguj się'}
                    </button>
                </div>
                </form>
        
                <div className="text-center text-sm text-gray-600">
                Nie masz jeszcze konta?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Zarejestruj się
                </Link>
                </div>
            </div>
            </div>
        );
}