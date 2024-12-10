"use client"
import { useParams } from 'next/navigation';

export default function ViewDetailLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}