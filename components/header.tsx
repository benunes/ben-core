"use client"

import { ModeToggle } from '@/components/toggle-button'

export function Header() {
    return (
        <header className="fixed top-4 right-4 z-[100]">
            <ModeToggle />
        </header>
    )
}

