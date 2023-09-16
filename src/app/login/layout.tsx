import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
}

export default function BoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="flex justify-center bg-gray-100 rounded-lg min-h-screen flex-col">{children}</div>
        </main>
    );
}
