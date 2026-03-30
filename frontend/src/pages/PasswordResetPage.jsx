import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../api/authApi';
import { Button } from '../components/ui/Button';
import { Footer } from '../features/Planner/components/Footer';
import { NavBar } from '../features/Planner/components/NavBar';

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

function PasswordResetPage({ mode = 'request' }) {
    const isResetMode = mode === 'reset';
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tokenFromQuery = useMemo(
        () => searchParams.get('token') || searchParams.get('resetToken') || '',
        [searchParams]
    );

    const [requestData, setRequestData] = useState({ email: '' });
    const [resetData, setResetData] = useState({
        token: tokenFromQuery,
        password: '',
        passwordConfirm: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordStrength = getPasswordStrength(resetData.password);

    const handleRequestChange = (event) => {
        const { name, value } = event.target;
        setRequestData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleResetChange = (event) => {
        const { name, value } = event.target;
        setResetData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleRequestSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const nextErrors = {};
        if (!isValidEmail(requestData.email)) {
            nextErrors.email = 'Please enter a valid email address.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await requestPasswordReset({
                email: requestData.email.trim(),
            });

            setSuccessMessage(
                response?.message || 'If that email exists, a password reset link has been sent.'
            );
        } catch (error) {
            setErrors({ email: error.message || 'Unable to send a reset link right now.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const nextErrors = {};
        if (!resetData.token.trim()) {
            nextErrors.token = 'Please paste your reset token or open the reset link from your email.';
        }
        if (resetData.password.length < 8) {
            nextErrors.password = 'Password must be at least 8 characters.';
        }
        if (resetData.password !== resetData.passwordConfirm) {
            nextErrors.passwordConfirm = 'Passwords do not match.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await resetPassword({
                token: resetData.token.trim(),
                password: resetData.password,
                newPassword: resetData.password,
            });

            setSuccessMessage(response?.message || 'Password updated successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1200);
        } catch (error) {
            setErrors({ token: error.message || 'Unable to reset your password right now.' });
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
                            PlanBear account recovery
                        </span>
                        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                            {isResetMode
                                ? 'Choose a new password and get back to planning.'
                                : 'Reset access without starting your account over.'}
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
                            {isResetMode
                                ? 'Use the reset link from your email to set a new password. If your backend sends a token, this page can read it from the URL or let you paste it in manually.'
                                : 'Enter the email tied to your account and we will send a reset link as soon as your backend endpoint is ready.'}
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">01</p>
                                <p className="mt-3 text-lg font-bold text-slate-900">Request link</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Send a recovery email from the frontend without exposing whether an account exists.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">02</p>
                                <p className="mt-3 text-lg font-bold text-slate-900">Paste token if needed</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Works with a query string token or a manual token field, depending on your backend flow.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">03</p>
                                <p className="mt-3 text-lg font-bold text-slate-900">Back to login</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Successful resets route users back into the existing account login experience.</p>
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
                                            {isResetMode ? 'Set a new password' : 'Forgot your password?'}
                                        </h2>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    isResetMode ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                    {isResetMode ? 'Reset' : 'Recovery'}
                                </span>
                            </div>

                            <form
                                onSubmit={isResetMode ? handleResetSubmit : handleRequestSubmit}
                                className="mt-6 space-y-5"
                            >
                                {!isResetMode ? (
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="example@email.com"
                                            value={requestData.email}
                                            onChange={handleRequestChange}
                                            className={getInputClassName(Boolean(errors.email))}
                                            required
                                        />
                                        {errors.email ? (
                                            <p className="mt-2 text-sm font-medium text-rose-600">{errors.email}</p>
                                        ) : null}
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="token" className="mb-2 block text-sm font-semibold text-slate-700">
                                                Reset token
                                            </label>
                                            <input
                                                type="text"
                                                id="token"
                                                name="token"
                                                placeholder="Paste token from your email"
                                                value={resetData.token}
                                                onChange={handleResetChange}
                                                className={getInputClassName(Boolean(errors.token))}
                                                required
                                            />
                                            {tokenFromQuery ? (
                                                <p className="mt-2 text-sm text-slate-500">
                                                    A token was detected in the URL and pre-filled for the user.
                                                </p>
                                            ) : null}
                                            {errors.token ? (
                                                <p className="mt-2 text-sm font-medium text-rose-600">{errors.token}</p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                                                New password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                placeholder="Create a new password"
                                                value={resetData.password}
                                                onChange={handleResetChange}
                                                className={getInputClassName(Boolean(errors.password))}
                                                required
                                            />
                                            {passwordStrength.text ? (
                                                <p className={`mt-2 text-sm font-semibold ${passwordStrength.tone}`}>
                                                    {passwordStrength.text}
                                                </p>
                                            ) : null}
                                            {errors.password ? (
                                                <p className="mt-2 text-sm font-medium text-rose-600">{errors.password}</p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="passwordConfirm"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Confirm new password
                                            </label>
                                            <input
                                                type="password"
                                                id="passwordConfirm"
                                                name="passwordConfirm"
                                                placeholder="Re-enter your new password"
                                                value={resetData.passwordConfirm}
                                                onChange={handleResetChange}
                                                className={getInputClassName(Boolean(errors.passwordConfirm))}
                                                required
                                            />
                                            {errors.passwordConfirm ? (
                                                <p className="mt-2 text-sm font-medium text-rose-600">
                                                    {errors.passwordConfirm}
                                                </p>
                                            ) : null}
                                        </div>
                                    </>
                                )}

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
                                        ? (isResetMode ? 'Updating password...' : 'Sending reset link...')
                                        : (isResetMode ? 'Reset Password' : 'Send Reset Link')}
                                </Button>
                            </form>

                            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
                                <p>{isResetMode ? 'Need a fresh reset email?' : 'Remember your password now?'}</p>
                                <Link
                                    to={isResetMode ? '/forgot-password' : '/login'}
                                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    {isResetMode ? 'Send another link' : 'Back to login'}
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

export default PasswordResetPage;
