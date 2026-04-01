import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
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
        return { text: 'Weak password', tone: 'text-[var(--rose-strong)]' };
    }
    if (score <= 4) {
        return { text: 'Medium password', tone: 'text-[var(--warning-strong)]' };
    }

    return { text: 'Strong password', tone: 'text-[var(--sage-strong)]' };
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getInputClassName(hasError) {
    return `h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4 ${
        hasError
            ? 'border-[rgba(141,103,98,0.4)] focus:border-[var(--rose-strong)] focus:ring-[var(--rose)]'
            : 'border-[var(--border)] focus:border-[var(--accent-strong)] focus:ring-[var(--accent-soft)]'
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
    const [token, setToken] = useState(null);
    const turnstileRef = useRef(null);

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

        if (!token) {
            setErrors({ captcha: 'Please complete the captcha.' });
            return;
        }

        try {
            setIsSubmitting(true);
            await signup({
                email: formData.email,
                username: formData.username.trim(),
                password: formData.password,
                studentYear: formData.studentYear,
                turnstileToken: token,
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
            setToken(null);
            turnstileRef.current?.reset();
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

        if (!token) {
            setErrors({ captcha: 'Please complete the captcha.' });
            return;
        }

        try {
            setIsSubmitting(true);
            const data = await login({
                username: formData.username.trim(),
                password: formData.password,
                turnstileToken: token,
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
            setToken(null);
            turnstileRef.current?.reset();
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <NavBar />

            <main className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(216,226,210,0.72),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(219,229,234,0.8),_transparent_34%)]" />

                <div className="relative mx-auto grid min-h-[calc(100vh-180px)] max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-20">
                    <section className="flex flex-col justify-center">
                        <span className="mb-5 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 text-sm font-semibold text-[var(--muted)]">
                            Account access
                        </span>
                        <h1 className="font-display max-w-2xl text-4xl font-semibold text-[var(--text)] md:text-6xl">
                            Keep your roadmap with you.
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
                            Sign in to save your plans across devices, or create an account when you want something permanent.
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">01</p>
                                <p className="mt-3 text-lg font-bold text-[var(--text)]">Save multiple plans</p>
                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                    Keep alternate versions of your roadmap without losing the one you already like.
                                </p>
                            </div>
                            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">02</p>
                                <p className="mt-3 text-lg font-bold text-[var(--text)]">Pick up where you left off</p>
                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                    Use the same planner on another device without rebuilding your schedule.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center justify-center">
                        <div className="w-full max-w-xl rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,245,0.92)] p-6 shadow-[0_24px_80px_rgba(100,88,74,0.12)] md:p-8">
                            <div className="flex items-center justify-between gap-4 border-b border-[rgba(217,206,195,0.7)] pb-5">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/logo.svg"
                                        alt="PlanBear logo"
                                        className="h-12 w-12 object-contain drop-shadow-[0_10px_16px_rgba(136,111,84,0.18)]"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted-soft)]">PlanBear</p>
                                        <h2 className="font-display text-3xl font-semibold text-[var(--text)]">
                                            {isLogin ? 'Welcome back' : 'Create your account'}
                                        </h2>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isLogin ? 'bg-[var(--sage)] text-[var(--sage-strong)]' : 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'}`}>
                                    {isLogin ? 'Login' : 'Signup'}
                                </span>
                            </div>

                            <div className="mt-6 inline-flex rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(true);
                                        setErrors({});
                                        setSuccessMessage('');
                                    }}
                                    className={`rounded-2xl px-5 py-2 text-sm font-semibold transition-colors ${
                                        isLogin ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--text)]'
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
                                        !isLogin ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--text)]'
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            <form onSubmit={isLogin ? handleLogin : handleSignup} className="mt-6 space-y-5">
                                {!isLogin ? (
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                            <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.email}</p>
                                        ) : null}
                                    </div>
                                ) : null}

                                {!isLogin ? (
                                    <div>
                                        <label htmlFor="studentYear" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                            <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.studentYear}</p>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div>
                                    <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                        <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.username}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                        <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.password}</p>
                                    ) : null}
                                    {isLogin ? (
                                        <div className="mt-3 flex justify-end">
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm font-semibold text-[var(--accent-strong)] transition-colors hover:text-[var(--text)]"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                    ) : null}
                                </div>

                                {!isLogin ? (
                                    <div>
                                        <label htmlFor="passwordConfirm" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                            <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.passwordConfirm}</p>
                                        ) : null}
                                    </div>
                                ) : null}

                                {successMessage ? (
                                    <div className="rounded-2xl border border-[var(--sage)] bg-[rgba(216,226,210,0.6)] px-4 py-3 text-sm font-medium text-[var(--sage-strong)]">
                                        {successMessage}
                                    </div>
                                ) : null}

                                <Turnstile
                                    ref={turnstileRef}
                                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                    onSuccess={(newToken) => setToken(newToken)}
                                    onExpire={() => setToken(null)}
                                />

                                {errors.captcha ? (
                                    <p className="text-sm font-medium text-[var(--rose-strong)]">{errors.captcha}</p>
                                ) : null}

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={!token || isSubmitting}
                                    className="h-12 w-full rounded-2xl bg-[var(--text)] text-[var(--surface)] hover:bg-[#4b5161] disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? (isLogin ? 'Logging in...' : 'Creating account...')
                                        : (isLogin ? 'Log In' : 'Create Account')}
                                </Button>
                            </form>

                            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[rgba(217,206,195,0.7)] pt-5 text-sm text-[var(--muted)]">
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
                                    className="font-semibold text-[var(--accent-strong)] transition-colors hover:text-[var(--text)]"
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
