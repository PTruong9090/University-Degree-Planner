import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, signup } from '../api/authApi';
import { Button } from '../components/ui/Button';
import { Footer } from '../features/Planner/components/Footer';
import { NavBar } from '../features/Planner/components/NavBar';

const STUDENT_YEAR_OPTIONS = [
    { value: 'freshman', label: 'Freshman' },
    { value: 'sophomore', label: 'Sophomore' },
    { value: 'junior', label: 'Junior' },
    { value: 'senior', label: 'Senior' },
];

function getPasswordStrength(password) {
    if (password.length === 0) {
        return { text: '', tone: '' };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
        return { text: 'Weak password', tone: 'text-rose-600' };
    }
    if (score <= 4) {
        return { text: 'Medium password', tone: 'text-amber-600' };
    }

    return { text: 'Strong password', tone: 'text-emerald-600' };
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getInputClassName(hasError) {
    return `h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4 ${
        hasError
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
    }`;
}

function LoginPage({ initialMode = 'login' }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        passwordConfirm: '',
        studentYear: 'freshman',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const nextErrors = {};

        if (!isValidEmail(formData.email)) {
            nextErrors.email = 'Please enter a valid email address.';
        }
        if (formData.username.trim().length < 3) {
            nextErrors.username = 'Username must be at least 3 characters.';
        }
        if (formData.password.length < 8) {
            nextErrors.password = 'Password must be at least 8 characters.';
        }
        if (formData.password !== formData.passwordConfirm) {
            nextErrors.passwordConfirm = 'Passwords do not match.';
        }
        if (!STUDENT_YEAR_OPTIONS.some((option) => option.value === formData.studentYear)) {
            nextErrors.studentYear = 'Please choose your current year.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            await signup({
                email: formData.email,
                username: formData.username.trim(),
                password: formData.password,
                studentYear: formData.studentYear,
            });

            setSuccessMessage('Account created successfully. You can log in now.');
            setTimeout(() => {
                setIsLogin(true);
                setFormData((prev) => ({
                    ...prev,
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    studentYear: prev.studentYear,
                }));
            }, 1200);
        } catch (error) {
            setErrors({ email: error.message || 'Unable to create account right now.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const nextErrors = {};
        if (!formData.username.trim()) {
            nextErrors.username = 'Please enter your username.';
        }
        if (!formData.password) {
            nextErrors.password = 'Please enter your password.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            const data = await login({
                username: formData.username.trim(),
                password: formData.password,
            });

            if (data?.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccessMessage('Login successful. Redirecting to your planner...');
                setTimeout(() => {
                    navigate('/planner');
                }, 1000);
            }
        } catch (error) {
            setErrors({ username: error.message || 'Unable to log in right now.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <NavBar />

            <main className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.22),_transparent_34%)]" />

                <div className="relative mx-auto grid min-h-[calc(100vh-180px)] max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-20">
                    <section className="flex flex-col justify-center">
                        <span className="mb-5 inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
                            PlanBear account access
                        </span>
                        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                            Save your roadmap across devices and keep every plan in one place.
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
                            Sign in to sync planners to your account, or create one now so your course plans stop living in a single browser.
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">01</p>
                                <p className="mt-3 text-lg font-bold text-slate-900">Multiple plans</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Keep alternate schedules, graduation paths, and backup quarter options.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">02</p>
                                <p className="mt-3 text-lg font-bold text-slate-900">Cloud-backed</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Pick up the same planner from another laptop without rebuilding it from scratch.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">03</p>
                                <p className="mt-3 text-lg font-bold text-slate-900">Fast planning</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Same clean planner, now with account access when you need it.</p>
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center justify-center">
                        <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] md:p-8">
                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                                        <img src="/logo.svg" alt="PlanBear logo" className="h-9 w-9" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">PlanBear.io</p>
                                        <h2 className="text-2xl font-black text-slate-900">
                                            {isLogin ? 'Welcome back' : 'Create your account'}
                                        </h2>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isLogin ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {isLogin ? 'Login' : 'Signup'}
                                </span>
                            </div>

                            <div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(true);
                                        setErrors({});
                                        setSuccessMessage('');
                                    }}
                                    className={`rounded-2xl px-5 py-2 text-sm font-semibold transition-colors ${
                                        isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Log In
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(false);
                                        setErrors({});
                                        setSuccessMessage('');
                                    }}
                                    className={`rounded-2xl px-5 py-2 text-sm font-semibold transition-colors ${
                                        !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            <form onSubmit={isLogin ? handleLogin : handleSignup} className="mt-6 space-y-5">
                                {!isLogin ? (
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={getInputClassName(Boolean(errors.email))}
                                            required
                                        />
                                        {errors.email ? (
                                            <p className="mt-2 text-sm font-medium text-rose-600">{errors.email}</p>
                                        ) : null}
                                    </div>
                                ) : null}

                                {!isLogin ? (
                                    <div>
                                        <label htmlFor="studentYear" className="mb-2 block text-sm font-semibold text-slate-700">
                                            Current year
                                        </label>
                                        <select
                                            id="studentYear"
                                            name="studentYear"
                                            value={formData.studentYear}
                                            onChange={handleChange}
                                            className={getInputClassName(Boolean(errors.studentYear))}
                                            required
                                        >
                                            {STUDENT_YEAR_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.studentYear ? (
                                            <p className="mt-2 text-sm font-medium text-rose-600">{errors.studentYear}</p>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div>
                                    <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder={isLogin ? 'Enter your username' : 'Choose a username'}
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={getInputClassName(Boolean(errors.username))}
                                        required
                                    />
                                    {errors.username ? (
                                        <p className="mt-2 text-sm font-medium text-rose-600">{errors.username}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={getInputClassName(Boolean(errors.password))}
                                        required
                                    />
                                    {!isLogin && passwordStrength.text ? (
                                        <p className={`mt-2 text-sm font-semibold ${passwordStrength.tone}`}>
                                            {passwordStrength.text}
                                        </p>
                                    ) : null}
                                    {errors.password ? (
                                        <p className="mt-2 text-sm font-medium text-rose-600">{errors.password}</p>
                                    ) : null}
                                </div>

                                {!isLogin ? (
                                    <div>
                                        <label htmlFor="passwordConfirm" className="mb-2 block text-sm font-semibold text-slate-700">
                                            Confirm password
                                        </label>
                                        <input
                                            type="password"
                                            id="passwordConfirm"
                                            name="passwordConfirm"
                                            placeholder="Re-enter your password"
                                            value={formData.passwordConfirm}
                                            onChange={handleChange}
                                            className={getInputClassName(Boolean(errors.passwordConfirm))}
                                            required
                                        />
                                        {errors.passwordConfirm ? (
                                            <p className="mt-2 text-sm font-medium text-rose-600">{errors.passwordConfirm}</p>
                                        ) : null}
                                    </div>
                                ) : null}

                                {successMessage ? (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                        {successMessage}
                                    </div>
                                ) : null}

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="h-12 w-full rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? (isLogin ? 'Logging in...' : 'Creating account...')
                                        : (isLogin ? 'Log In' : 'Create Account')}
                                </Button>
                            </form>

                            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
                                <p>
                                    {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
                                </p>
                                <Link
                                    to={isLogin ? '/signup' : '/login'}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setIsLogin((prev) => !prev);
                                        setErrors({});
                                        setSuccessMessage('');
                                    }}
                                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    {isLogin ? 'Create one' : 'Log in'}
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default LoginPage;
