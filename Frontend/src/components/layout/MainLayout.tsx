import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            <div className="flex">
                <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                <main className="flex-1 p-4 md:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};
