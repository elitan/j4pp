'use client';

import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/utils/trpc';

interface SelectedFile {
  file: File;
  data: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // tRPC hooks
  const uploadMutation = api.files.upload.useMutation();
  const { data: userFiles, refetch: refetchFiles } =
    api.files.getUserFiles.useQuery();
  const deleteMutation = api.files.delete.useMutation();
  const getDownloadUrlMutation = api.files.getDownloadUrl.useMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 10MB for demo)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadError('');
    setUploadMessage('');

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1]; // Remove data:mime;base64, prefix

      setSelectedFile({
        file,
        data: base64Data,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError('');
    setUploadMessage('');

    try {
      const result = await uploadMutation.mutateAsync({
        filename: selectedFile.file.name,
        mimeType: selectedFile.file.type,
        size: selectedFile.file.size,
        data: selectedFile.data,
      });

      setUploadMessage(result.message);
      setSelectedFile(null);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refetch user files to show the new upload
      await refetchFiles();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteMutation.mutateAsync({ fileId });
      await refetchFiles();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const result = await getDownloadUrlMutation.mutateAsync({ fileId });
      if (result.downloadUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Upload files to your secure storage. Maximum file size: 10MB
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <input
              ref={fileInputRef}
              type='file'
              onChange={handleFileSelect}
              className='block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100'
            />
          </div>

          {selectedFile && (
            <div className='rounded-md bg-gray-50 p-3'>
              <p className='text-sm font-medium'>{selectedFile.file.name}</p>
              <p className='text-xs text-gray-500'>
                {formatFileSize(selectedFile.file.size)} •{' '}
                {selectedFile.file.type}
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className='w-full'
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>

          {uploadMessage && (
            <div className='rounded-md border border-green-200 bg-green-50 p-3'>
              <p className='text-sm text-green-800'>{uploadMessage}</p>
            </div>
          )}

          {uploadError && (
            <div className='rounded-md border border-red-200 bg-red-50 p-3'>
              <p className='text-sm text-red-800'>{uploadError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
          <CardDescription>Manage your uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          {userFiles?.files.length === 0 ? (
            <p className='py-4 text-center text-gray-500'>
              No files uploaded yet
            </p>
          ) : (
            <div className='space-y-3'>
              {userFiles?.files.map((file) => (
                <div
                  key={file.id}
                  className='flex items-center justify-between rounded-md border p-3'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium'>{file.filename}</p>
                      <Badge variant='secondary'>{file.status}</Badge>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                      <span>{formatFileSize(Number(file.size))}</span>
                      <span>{file.mimeType}</span>
                      <span>{formatDate(file.createdAt!)}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDownload(file.id, file.filename)}
                      disabled={getDownloadUrlMutation.isPending}
                    >
                      Download
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(file.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
