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
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <NavBar />

            <main className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(216,226,210,0.72),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(219,229,234,0.8),_transparent_34%)]" />

                <div className="relative mx-auto grid min-h-[calc(100vh-180px)] max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-20">
                    <section className="flex flex-col justify-center">
                        <span className="mb-5 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 text-sm font-semibold text-[var(--muted)]">
                            Account recovery
                        </span>
                        <h1 className="font-display max-w-2xl text-4xl font-semibold text-[var(--text)] md:text-6xl">
                            {isResetMode
                                ? 'Choose a new password and get back to planning.'
                                : 'Reset access without rebuilding your account.'}
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
                            {isResetMode
                                ? 'Use the reset link from your email, or paste the token here if your backend flow needs it.'
                                : 'Enter the email tied to your account and we will send a reset link if the account exists.'}
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">01</p>
                                <p className="mt-3 text-lg font-bold text-[var(--text)]">Request a reset</p>
                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                    Send a recovery email without exposing whether an account exists.
                                </p>
                            </div>
                            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(100,88,74,0.08)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">02</p>
                                <p className="mt-3 text-lg font-bold text-[var(--text)]">Set a new password</p>
                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                    Once the reset works, you can head straight back to login and continue planning.
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
                                            {isResetMode ? 'Set a new password' : 'Forgot your password?'}
                                        </h2>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    isResetMode ? 'bg-[var(--sage)] text-[var(--sage-strong)]' : 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'
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
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                            <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.email}</p>
                                        ) : null}
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="token" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                                <p className="mt-2 text-sm text-[var(--muted)]">
                                                    A token was detected in the URL and pre-filled for the user.
                                                </p>
                                            ) : null}
                                            {errors.token ? (
                                                <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.token}</p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[var(--text)]">
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
                                                <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">{errors.password}</p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="passwordConfirm"
                                                className="mb-2 block text-sm font-semibold text-[var(--text)]"
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
                                                <p className="mt-2 text-sm font-medium text-[var(--rose-strong)]">
                                                    {errors.passwordConfirm}
                                                </p>
                                            ) : null}
                                        </div>
                                    </>
                                )}

                                {successMessage ? (
                                    <div className="rounded-2xl border border-[var(--sage)] bg-[rgba(216,226,210,0.6)] px-4 py-3 text-sm font-medium text-[var(--sage-strong)]">
                                        {successMessage}
                                    </div>
                                ) : null}

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="h-12 w-full rounded-2xl bg-[var(--text)] text-[var(--surface)] hover:bg-[#4b5161] disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? (isResetMode ? 'Updating password...' : 'Sending reset link...')
                                        : (isResetMode ? 'Reset Password' : 'Send Reset Link')}
                                </Button>
                            </form>

                            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[rgba(217,206,195,0.7)] pt-5 text-sm text-[var(--muted)]">
                                <p>{isResetMode ? 'Need a fresh reset email?' : 'Remember your password now?'}</p>
                                <Link
                                    to={isResetMode ? '/forgot-password' : '/login'}
                                    className="font-semibold text-[var(--accent-strong)] transition-colors hover:text-[var(--text)]"
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
