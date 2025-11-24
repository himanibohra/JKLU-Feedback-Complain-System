import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
    subtitle?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    value,
    icon: Icon,
    color = 'blue',
    subtitle,
}) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

interface DashboardCardsProps {
    cards: Array<{
        title: string;
        value: string | number;
        icon: LucideIcon;
        color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
        subtitle?: string;
    }>;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ cards }) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <DashboardCard key={index} {...card} />
            ))}
        </div>
    );
};
