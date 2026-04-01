export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-[var(--border)] bg-[rgba(255,250,245,0.8)] py-5 text-center text-sm text-[var(--muted)]">
            <p className="font-medium">&copy; {currentYear} PlanBear</p>
            <p className="mt-2 text-xs text-[var(--muted-soft)]">
                Built for student planning. Not affiliated with UCLA.
            </p>
        </footer>
    )
}
