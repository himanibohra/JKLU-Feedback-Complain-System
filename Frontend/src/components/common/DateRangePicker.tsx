import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { formatDateForInput } from '@/utils/dateUtils';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    label?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    label = 'Date Range',
}) => {
    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="input pl-10"
                        placeholder="Start date"
                    />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        min={startDate}
                        className="input pl-10"
                        placeholder="End date"
                    />
                </div>
            </div>
        </div>
    );
};
