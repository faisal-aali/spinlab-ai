'use client' // Error components must be Client Components

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div>
            <h2>Unexpected error occured</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => router.replace('/login')
                }
            >
                Login
            </button>
        </div>
    )
}