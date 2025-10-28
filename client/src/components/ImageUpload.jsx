import { useState, useEffect, useRef } from 'react';
import { FaImage, FaUpload, FaLink, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

/**
 * Enhanced Image Upload component with both URL input and Cloudinary file upload
 */
function ImageUpload({ value, onChange, onPublicIdChange }) {
    const [previewUrl, setPreviewUrl] = useState(value || '');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');
    const [urlInput, setUrlInput] = useState(value || '');
    const fileInputRef = useRef(null);

    // Update preview and input when parent value changes
    useEffect(() => {
        setPreviewUrl(value || '');
        setUrlInput(value || '');
    }, [value]);

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrlInput(newUrl);
    };

    const handleUrlBlur = () => {
        // Only update parent when user leaves the input field
        if (urlInput !== value) {
            onChange(urlInput);
            setPreviewUrl(urlInput);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', 'movie-posters');

            const response = await axiosInstance.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const { url, publicId } = response.data.data;
                onChange(url);
                setUrlInput(url);
                if (onPublicIdChange) {
                    onPublicIdChange(publicId);
                }
                setPreviewUrl(url);
                toast.success('Image uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upload image. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const clearImage = () => {
        onChange('');
        setUrlInput('');
        if (onPublicIdChange) {
            onPublicIdChange('');
        }
        setPreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleBrowseClick = (e) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-600">
                <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'upload'
                            ? 'text-red-500 border-b-2 border-red-500'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <FaCloudUploadAlt className="inline mr-2" />
                    Upload File
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('url')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'url'
                            ? 'text-red-500 border-b-2 border-red-500'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <FaLink className="inline mr-2" />
                    Enter URL
                </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Upload Poster Image
                    </label>

                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={handleBrowseClick}
                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragOver
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-gray-600 hover:border-gray-500'
                            } ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            disabled={isUploading}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <FaCloudUploadAlt className="h-12 w-12 text-red-500 mb-4 animate-pulse" />
                                <p className="text-red-500">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <FaUpload className={`h-12 w-12 mb-4 ${isDragOver ? 'text-red-500' : 'text-gray-400'}`} />
                                <p className={`${isDragOver ? 'text-red-500' : 'text-gray-400'} mb-2`}>
                                    Drop your image here or click to browse
                                </p>
                                <p className="text-xs text-gray-500">
                                    Supports: JPEG, PNG, GIF, WebP (max 5MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* URL Tab */}
            {activeTab === 'url' && (
                <div>
                    <label
                        htmlFor="posterUrl"
                        className="md-label"
                    >
                        Poster Image URL
                    </label>
                    <input
                        type="url"
                        id="posterUrl"
                        value={urlInput}
                        onChange={handleUrlChange}
                        onBlur={handleUrlBlur}
                        className="md-input"
                        placeholder="https://example.com/image.png"
                    />
                </div>
            )}

            {/* Image Preview */}
            <div className="relative">
                <div className="w-full h-48 bg-gray-900 rounded-md flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Poster Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                const placeholder = e.target.nextElementSibling;
                                if (placeholder) placeholder.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                                e.target.style.display = 'block';
                                const placeholder = e.target.nextElementSibling;
                                if (placeholder) placeholder.style.display = 'none';
                            }}
                        />
                    ) : null}
                    <div
                        className={`absolute inset-0 flex flex-col items-center justify-center text-gray-500 ${previewUrl ? 'hidden' : ''}`}
                    >
                        <FaImage className="h-12 w-12" />
                        <span className="mt-2 text-sm">
                            {previewUrl ? 'Failed to load image' : 'No image selected'}
                        </span>
                    </div>
                </div>

                {/* Clear Button */}
                {previewUrl && (
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1 text-sm text-red-400 hover:text-red-300 bg-gray-900/80 hover:bg-red-900/60 rounded-md transition-colors backdrop-blur-sm"
                    >
                        <FaTimes />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;