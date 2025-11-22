import prisma from '@/lib/prisma'
import { Header } from '@/components/header'

export default async function Home() {
    const users = await prisma.user.findMany();
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center -mt-16 relative">
            {/* Toggle button en haut à droite */}
            <Header />

            {/* Contenu principal avec un card pour meilleur contraste */}
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-foreground">
                    Superblog
                </h1>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm min-w-[300px]">
                    <h2 className="text-xl font-semibold mb-4 text-card-foreground">Utilisateurs</h2>
                    <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)] text-card-foreground space-y-2">
                        {users.map((user) => (
                            <li key={user.id} className="mb-2">
                                {user.name}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}