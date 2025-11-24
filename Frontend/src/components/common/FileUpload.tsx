import React, { useRef, useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFilesSelected,
    accept = '*',
    multiple = true,
    maxSize = 10,
    maxFiles = 5,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Validate file size
        const validFiles = files.filter(file => {
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxSize) {
                alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
                return false;
            }
            return true;
        });

        // Limit number of files
        const limitedFiles = validFiles.slice(0, maxFiles);

        setSelectedFiles(prev => {
            const newFiles = [...prev, ...limitedFiles].slice(0, maxFiles);
            onFilesSelected(newFiles);
            return newFiles;
        });
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== index);
            onFilesSelected(newFiles);
            return newFiles;
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));
            fileInputRef.current.files = dataTransfer.files;
            handleFileChange({ target: fileInputRef.current } as any);
        }
    };

    return (
        <div className="space-y-4">
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-2">
                    Drag and drop files here, or click to select
                </p>
                <p className="text-sm text-gray-400">
                    Maximum {maxFiles} files, {maxSize}MB each
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <File size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    />
                </div>
            )}
        </div>
    );
};
