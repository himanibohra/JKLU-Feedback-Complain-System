import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface BarChartData {
    name: string;
    value: number;
    [key: string]: any;
}

interface AdminBarChartProps {
    data: BarChartData[];
    dataKey: string;
    xAxisKey: string;
    title: string;
}

export const AdminBarChart: React.FC<AdminBarChartProps> = ({
    data,
    dataKey,
    xAxisKey,
    title,
}) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisKey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={dataKey} fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

interface PieChartData {
    name: string;
    value: number;
}

interface AdminPieChartProps {
    data: PieChartData[];
    title: string;
}

export const AdminPieChart: React.FC<AdminPieChartProps> = ({ data, title }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

interface LineChartData {
    date: string;
    count: number;
    resolved?: number;
}

interface AdminLineChartProps {
    data: LineChartData[];
    title: string;
}

export const AdminLineChart: React.FC<AdminLineChartProps> = ({ data, title }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Total" />
                    {data[0]?.resolved !== undefined && (
                        <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
