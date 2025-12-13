import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Calendar, 
  Video, 
  Camera, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Upload,
  Eye,
  LogOut,
  FileImage,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Users,
  Crop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import ImageCropModal from '@/components/ImageCropModal';
import Footer from '@/components/Footer';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  registrationRequired: boolean;
  image?: string;
}

interface LiveStream {
  id: string;
  title: string;
  url: string;
  schedule: string;
  isLive: boolean;
}

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  category: string;
}

interface Message {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'events' | 'livestream' | 'gallery' | 'messages' | 'subscribers'>('events');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editStatus, setEditStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // Bulk selection state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Delete progress state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  // Debug showForm changes
  useEffect(() => {
    console.log('showForm changed to:', showForm, 'activeTab:', activeTab, 'editingItem:', editingItem);
  }, [showForm, activeTab, editingItem]);

  // Fetch data from database APIs
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [eventsRes, streamsRes, galleryRes, messagesRes, subscribersRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/live-streams'),
        fetch('/api/gallery'),
        fetch('/api/messages'),
        fetch('/api/admin/subscribers')
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }

      if (streamsRes.ok) {
        const streamsData = await streamsRes.json();
        setLiveStreams(streamsData);
      }

      if (galleryRes.ok) {
        const galleryData = await galleryRes.json();
        console.log('Gallery images loaded:', galleryData);
        console.log('First image URL:', galleryData[0]?.url);
        setGalleryImages(galleryData);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json();
        setSubscribers(subscribersData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Form states for different content types
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'Special Event',
    registrationRequired: false,
    image: ''
  });
  
  const [streamForm, setStreamForm] = useState({
    title: '',
    url: '',
    schedule: '',
    isLive: false
  });
  
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    url: '',
    date: '',
    category: 'Worship'
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  // Image crop modal states
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState<string>('');
  const [cropFileIndex, setCropFileIndex] = useState<number>(-1);
  
  // Event thumbnail upload states
  const [eventThumbnailFile, setEventThumbnailFile] = useState<File | null>(null);
  const [eventUploadProgress, setEventUploadProgress] = useState(0);
  const [eventUploadStatus, setEventUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // File upload functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('Files selected:', files);
    
    if (files && files.length > 0) {
      const validFiles: File[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i}:`, file.name, file.type, file.size);
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn(`${file.name} is not an image file. Skipping.`);
          alert(`${file.name} is not an image file. Skipping.`);
          continue;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Skipping.`);
          alert(`${file.name} is too large (max 10MB). Skipping.`);
          continue;
        }
        
        validFiles.push(file);
      }
      
      console.log('Valid files:', validFiles);
      
      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        setUploadStatus('idle');
      } else {
        console.log('No valid files to upload');
        alert('No valid image files were selected. Please select image files under 10MB each.');
      }
    } else {
      console.log('No files selected');
    }
  };

  // Handle crop modal
  const handleCropImage = (file: File, index: number) => {
    const objectUrl = URL.createObjectURL(file);
    setCropImageUrl(objectUrl);
    setCropFileIndex(index);
    setShowCropModal(true);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    // Convert the cropped image URL to a File object
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], selectedFiles[cropFileIndex].name, { type: 'image/jpeg' });
        const newFiles = [...selectedFiles];
        newFiles[cropFileIndex] = file;
        setSelectedFiles(newFiles);
        
        // Clean up the object URL
        URL.revokeObjectURL(croppedImageUrl);
      })
      .catch(error => {
        console.error('Error converting cropped image:', error);
      });
    
    setShowCropModal(false);
  };

  const handleEventThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setEventThumbnailFile(file);
      setEventUploadStatus('idle');
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('adminAuth') === 'true' ? 'admin' : '';
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      setUploadStatus('success');
      return result.url;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      throw error;
    }
  };

  const uploadEventThumbnail = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    setEventUploadStatus('uploading');
    setEventUploadProgress(0);
    
    try {
      const token = localStorage.getItem('adminAuth') === 'true' ? 'admin' : '';
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      setEventUploadStatus('success');
      return result.url;
    } catch (error) {
      console.error('Upload error:', error);
      setEventUploadStatus('error');
      throw error;
    }
  };

  const handleOneDriveConnect = async () => {
    try {
      // Use redirect flow so we don't need auth headers in the popup
      window.open('/api/onedrive/auth-start?redirect=1', '_blank', 'width=600,height=700');
      alert('After signing in to Microsoft, return here and click "Choose from OneDrive" or upload again.');
    } catch (error) {
      console.error('OneDrive connect error:', error);
      alert('Failed to start OneDrive auth. Please try again.');
    }
  };

  const handleOneDriveStatus = async () => {
    try {
      const res = await fetch('/api/admin/onedrive/status', {
        headers: { 'Authorization': 'Bearer admin' }
      });
      if (!res.ok) {
        setOneDriveStatus('disconnected');
        alert('Not connected. Click Connect OneDrive.');
        return;
      }
      const data = await res.json();
      setOneDriveStatus(data.connected ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('OneDrive status error:', error);
      setOneDriveStatus('disconnected');
      alert('Unable to check OneDrive status.');
    }
  };

  const handleOneDriveBrowse = async () => {
    try {
      setOneDriveLoading(true);
      // Check status first
      const statusRes = await fetch('/api/admin/onedrive/status', {
        headers: { 'Authorization': 'Bearer admin' }
      });
      if (statusRes.ok) {
        const status = await statusRes.json();
        if (!status.connected) {
          alert('Please click "Connect OneDrive" and sign in first.');
          setOneDriveLoading(false);
          return;
        }
      }

      const res = await fetch('/api/admin/onedrive/list', {
        headers: { 'Authorization': 'Bearer admin' }
      });
      if (!res.ok) {
        alert('Unable to browse OneDrive. Make sure you clicked Connect OneDrive and completed login.');
        return;
      }
      const data = await res.json();
      setOneDriveFiles(data.items || []);

      if (!data.items || data.items.length === 0) {
        alert('No images found in your OneDrive (root or folder).');
        return;
      }

      // Simple prompt-based picker for now
      const choices = data.items
        .map((f: any, idx: number) => `${idx + 1}. ${f.name} (${Math.round((f.size || 0) / 1024)} KB)`)
        .join('\n');
      const choice = window.prompt(`Select an image by number:\n${choices}`);
      if (!choice) return;
      const idx = parseInt(choice, 10) - 1;
      if (isNaN(idx) || idx < 0 || idx >= data.items.length) {
        alert('Invalid selection');
        return;
      }

      const selected = data.items[idx];
      // Get share link
      const shareRes = await fetch('/api/admin/onedrive/share', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId: selected.id })
      });
      if (!shareRes.ok) {
        alert('Failed to create share link for the selected file.');
        return;
      }
      const shareData = await shareRes.json();
      setGalleryForm(prev => ({ ...prev, url: shareData.url }));
      setSelectedFiles([]);
      setUploadStatus('success');
      setUploadProgress(100);
      alert(`Selected from OneDrive: ${selected.name}\nShare link set. Click Save to create the gallery item.`);
    } catch (error) {
      console.error('OneDrive browse error:', error);
      alert('Failed to browse OneDrive. Please try again.');
    } finally {
      setOneDriveLoading(false);
      setUploadProgress(0);
    }
  };

  const handleOneDriveUpload = async () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.multiple = false;

      fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setUploadStatus('uploading');
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/onedrive/upload', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer admin'
          },
          body: formData
        });

        if (!res.ok) {
          setUploadStatus('error');
          alert('OneDrive upload failed. If not connected, click Connect OneDrive first.');
          return;
        }

        const data = await res.json();
        setGalleryForm(prev => ({ ...prev, url: data.url }));
        setSelectedFiles([]);
        setUploadStatus('success');
        setUploadProgress(100);
        alert('Uploaded to OneDrive. Click Save to create the gallery item.');
      };

      fileInput.click();
    } catch (error) {
      console.error('OneDrive upload error:', error);
      setUploadStatus('error');
      alert('Failed to upload to OneDrive. Please try again.');
    } finally {
      setUploadProgress(0);
    }
  };
  
  const [messageForm, setMessageForm] = useState({
    title: '',
    content: '',
    date: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Data from database
  const [events, setEvents] = useState<Event[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  // OneDrive browse state
  const [oneDriveFiles, setOneDriveFiles] = useState<{ id: string; name: string; webUrl: string; size: number; mimeType?: string }[]>([]);
  const [oneDriveLoading, setOneDriveLoading] = useState(false);
  const [oneDriveStatus, setOneDriveStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'livestream', label: 'Live Streams', icon: Video },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'subscribers', label: 'Subscribers', icon: Users }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setIsDeleting(true);
        setDeleteProgress(0);
        
        const token = localStorage.getItem('adminAuth') === 'true' ? 'admin' : '';
        setDeleteProgress(50);
        
        const response = await fetch(`/api/admin/${type}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setDeleteProgress(75);

        if (response.ok) {
          // Refresh data from database
          await fetchData();
          setDeleteProgress(100);
        } else {
          console.error('Failed to delete item');
          alert('Failed to delete item. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      } finally {
        setIsDeleting(false);
        setDeleteProgress(0);
      }
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async (type: string) => {
    if (selectedItems.size === 0) {
      alert('No items selected');
      return;
    }

    const count = selectedItems.size;
    if (window.confirm(`Are you sure you want to delete ${count} item(s)?`)) {
      try {
        setIsDeleting(true);
        setDeleteProgress(0);
        
        const token = localStorage.getItem('adminAuth') === 'true' ? 'admin' : '';
        const items = Array.from(selectedItems);
        
        // Delete items one by one with progress
        for (let i = 0; i < items.length; i++) {
          const id = items[i];
          const progress = Math.round(((i + 1) / items.length) * 90);
          setDeleteProgress(progress);
          
          await fetch(`/api/admin/${type}/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        setDeleteProgress(95);
        await fetchData();
        setSelectedItems(new Set());
        setDeleteProgress(100);
        
        setTimeout(() => {
          alert(`Successfully deleted ${count} item(s)`);
        }, 300);
      } catch (error) {
        console.error('Error deleting items:', error);
        alert('Failed to delete some items');
      } finally {
        setIsDeleting(false);
        setTimeout(() => setDeleteProgress(0), 500);
      }
    }
  };

  // Toggle item selection
  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Select all items
  const selectAll = () => {
    let allIds: string[] = [];
    switch (activeTab) {
      case 'events':
        allIds = events.map(e => e.id);
        break;
      case 'livestream':
        allIds = liveStreams.map(s => s.id);
        break;
      case 'gallery':
        allIds = galleryImages.map(i => i.id);
        break;
      case 'messages':
        allIds = messages.map(m => m.id);
        break;
    }
    setSelectedItems(new Set(allIds));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setShowForm(true);
    setEditingItem(null);
    // Reset forms
    setEventForm({ title: '', date: '', time: '', location: '', description: '', category: 'Special Event', registrationRequired: false, image: '' });
    setStreamForm({ title: '', url: '', schedule: '', isLive: false });
    setGalleryForm({ title: '', url: '', date: '', category: 'Worship' });
    setMessageForm({ title: '', content: '', date: '', priority: 'medium' });
    // Reset file upload states
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadStatus('idle');
    // Reset event thumbnail upload states
    setEventThumbnailFile(null);
    setEventUploadProgress(0);
    setEventUploadStatus('idle');
  };

  const handleEdit = (type: string, id: string) => {
    console.log('handleEdit called:', { type, id, activeTab, galleryImagesCount: galleryImages.length });
    setEditingItem(id);
    setShowForm(true);
    setIsAddingNew(false);
    setHasUnsavedChanges(false);
    setEditStatus('idle');
    
    // Populate form with existing data
    switch (type) {
      case 'events':
        const event = events.find(e => e.id === id);
        console.log('Found event:', event);
        if (event) setEventForm(event);
        break;
      case 'live-streams':
      case 'livestream':
        const stream = liveStreams.find(s => s.id === id);
        console.log('Found stream:', stream);
        if (stream) setStreamForm(stream);
        break;
      case 'gallery':
        const image = galleryImages.find(i => i.id === id);
        console.log('Found gallery image:', image);
        if (image) setGalleryForm(image);
        break;
      case 'messages':
        const message = messages.find(m => m.id === id);
        console.log('Found message:', message);
        if (message) setMessageForm(message);
        break;
    }
    console.log('After handleEdit, showForm:', true);
  };

  // Track form changes
  const handleFormChange = (formType: string, field: string, value: any) => {
    setHasUnsavedChanges(true);
    setEditStatus('idle');
    
    switch (formType) {
      case 'events':
        setEventForm(prev => ({ ...prev, [field]: value }));
        break;
      case 'live-streams':
      case 'livestream':
        setStreamForm(prev => ({ ...prev, [field]: value }));
        break;
      case 'gallery':
        setGalleryForm(prev => ({ ...prev, [field]: value }));
        break;
      case 'messages':
        setMessageForm(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const handleSave = async () => {
    try {
      setEditStatus('saving');
      const token = localStorage.getItem('adminAuth') === 'true' ? 'admin' : '';
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (isAddingNew) {
        // Add new item
        let endpoint = '';
        let data = {};
        
        switch (activeTab) {
          case 'events':
            endpoint = '/api/admin/events';
            // If a thumbnail file is selected, upload it first
            if (eventThumbnailFile) {
              try {
                const uploadedUrl = await uploadEventThumbnail(eventThumbnailFile);
                data = { ...eventForm, image: uploadedUrl };
              } catch (error) {
                console.error('Thumbnail upload failed:', error);
                alert('Failed to upload thumbnail. Please try again.');
                return;
              }
            } else {
              data = eventForm;
            }
            break;
          case 'livestream':
            endpoint = '/api/admin/live-streams';
            data = streamForm;
            break;
          case 'gallery':
            endpoint = '/api/admin/gallery';
            // Validation: Must have either files or URL
            if (selectedFiles.length === 0 && !galleryForm.url) {
              alert('Please either upload image(s) or provide an image URL');
              return;
            }
            
            // If multiple files are selected, upload them all
            if (selectedFiles.length > 0) {
              try {
                // Upload all files and create gallery items for each
                const uploadPromises = selectedFiles.map(file => uploadFile(file));
                const uploadedUrls = await Promise.all(uploadPromises);
                
                // Create multiple gallery items (one for each uploaded image)
                const createPromises = uploadedUrls.map(async (url) => {
                  const response = await fetch(endpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ ...galleryForm, url })
                  });
                  return response.json();
                });
                
                await Promise.all(createPromises);
                
                setEditStatus('success');
                await fetchData();
                setShowForm(false);
                setIsAddingNew(false);
                setEditingItem(null);
                setHasUnsavedChanges(false);
                setSelectedFiles([]);
                return;
              } catch (error) {
                console.error('File upload failed:', error);
                alert('Failed to upload images. Please try again.');
                return;
              }
            } else {
              data = galleryForm;
            }
            break;
          case 'messages':
            endpoint = '/api/admin/messages';
            data = messageForm;
            break;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });

        if (response.ok) {
          setEditStatus('success');
          // Refresh data from database
          await fetchData();
          // Reset form after successful save
          setShowForm(false);
          setIsAddingNew(false);
          setEditingItem(null);
          setHasUnsavedChanges(false);
        } else {
          setEditStatus('error');
          console.error('Failed to create item');
        }
      } else {
        // Update existing item
        let endpoint = '';
        let data = {};
        
        switch (activeTab) {
          case 'events':
            endpoint = `/api/admin/events/${editingItem}`;
            data = eventForm;
            break;
          case 'livestream':
            endpoint = `/api/admin/live-streams/${editingItem}`;
            data = streamForm;
            break;
          case 'gallery':
            endpoint = `/api/admin/gallery/${editingItem}`;
            data = galleryForm;
            break;
          case 'messages':
            endpoint = `/api/admin/messages/${editingItem}`;
            data = messageForm;
            break;
        }

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data)
        });

        if (response.ok) {
          // Refresh data from database
          await fetchData();
        } else {
          console.error('Failed to update item');
        }
      }
      
      // Reset form
      setShowForm(false);
      setIsAddingNew(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsAddingNew(false);
    setEditingItem(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUser');
      setLocation('/admin/login');
    }
  };

  const handleSendEmail = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to send this message to all subscribers?')) {
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus('sending');
    setEmailMessage('');

    try {
      const token = localStorage.getItem('adminAuth') === 'true' ? 'admin' : '';
      const response = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messageId })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailStatus('success');
        setEmailMessage(`Message sent successfully! Sent to ${data.sent} subscribers. ${data.failed > 0 ? `${data.failed} failed.` : ''}`);
      } else {
        setEmailStatus('error');
        setEmailMessage(data.message || 'Failed to send message');
      }
    } catch (error) {
      setEmailStatus('error');
      setEmailMessage('Network error. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-black/80 to-black/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">
                    Admin <span className="text-white">Dashboard</span>
                  </h1>
                  <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                    Manage your church website content, events, live streams, gallery, and announcements.
                  </p>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Global Progress Bars */}
        <div className="sticky top-16 z-40">
          {/* Upload Progress */}
          {uploadStatus === 'uploading' && (
            <div className="bg-blue-500/20 border-b border-blue-500/30 px-4 py-2">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Uploading images...</p>
                    <div className="mt-1 w-full bg-blue-900/30 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Delete Progress */}
          {isDeleting && (
            <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-2">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Deleting items...</p>
                    <div className="mt-1 w-full bg-red-900/30 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${deleteProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Panel */}
        <section className="py-20 bg-black/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id 
                      ? "bg-white text-black hover:bg-white/90" 
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Add New Button */}
            <div className="mb-8 text-center">
              <Button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New {tabs.find(t => t.id === activeTab)?.label}
              </Button>
            </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white/70">Loading data...</p>
                </div>
              )}

              {/* Content Area */}
              {!isLoading && (
              <div className="grid grid-cols-1 gap-6">
              {/* Events Management */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} className="bg-white/5 border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-2">
                              <span>📅 {event.date}</span>
                              <span>🕐 {event.time}</span>
                              <span>📍 {event.location}</span>
                            </div>
                            <p className="text-white/80 text-sm">{event.description}</p>
                            <div className="mt-2">
                              <Badge className={`${event.registrationRequired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {event.registrationRequired ? 'Registration Required' : 'Open to All'}
                              </Badge>
                              <Badge className="ml-2 bg-blue-100 text-blue-800">
                                {event.category}
                              </Badge>
                            <Badge className="ml-2 bg-amber-100 text-amber-800">
                              {(event.currentAttendees ?? 0)}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''} registered
                            </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-white/30 text-white"
                              onClick={() => handleEdit('events', event.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-300 hover:bg-red-300/10"
                              onClick={() => handleDelete('events', event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Live Streams Management */}
              {activeTab === 'livestream' && (
                <div className="space-y-4">
                  {liveStreams.map((stream) => (
                    <Card key={stream.id} className="bg-white/5 border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{stream.title}</h3>
                              {stream.isLive && (
                                <Badge className="bg-red-100 text-red-800 animate-pulse">LIVE</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-2">
                              <span>📺 {stream.url}</span>
                              <span>🕐 {stream.schedule}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-white/30 text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-white/30 text-white"
                              onClick={() => handleEdit('live-streams', stream.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-300 hover:bg-red-300/10"
                              onClick={() => handleDelete('live-streams', stream.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Gallery Management */}
              {activeTab === 'gallery' && (
                <>
                  {/* Bulk Actions Bar */}
                  {selectedItems.size > 0 && (
                    <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-white font-medium">
                          {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-300 text-blue-300 hover:bg-blue-300/10"
                          onClick={() => handleBulkDelete('gallery')}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                          onClick={clearSelection}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Select All / Deselect All */}
                  <div className="mb-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={selectAll}
                    >
                      Select All
                    </Button>
                    {selectedItems.size > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                        onClick={clearSelection}
                      >
                        Deselect All
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image) => (
                    <Card key={image.id} className="bg-white/5 border-white/20 overflow-hidden relative">
                      {/* Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(image.id)}
                          onChange={() => toggleItemSelection(image.id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="aspect-video bg-black/30 flex items-center justify-center p-2 relative">
                        <img 
                          src={image.url} 
                          alt={image.title}
                          className="max-w-full max-h-full object-contain rounded"
                          onLoad={() => {
                            console.log('Image loaded successfully:', image.url);
                          }}
                          onError={(e) => {
                            console.error('Failed to load image:', image.url);
                            console.error('Image title:', image.title);
                            e.currentTarget.style.display = 'none';
                          }}
                          loading="lazy"
                        />
                        {/* Fallback placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs pointer-events-none opacity-50">
                          <FileImage className="h-6 w-6" />
                          <span className="ml-2 text-xs">{image.title}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-white font-semibold mb-2">{image.title}</h3>
                        <div className="flex justify-between items-center text-sm text-white/70 mb-3">
                          <span>📅 {image.date}</span>
                          <Badge className="bg-blue-100 text-blue-800">{image.category}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              console.log('Button clicked!', image.id);
                              e.preventDefault();
                              e.stopPropagation();
                              alert('Edit button clicked for: ' + image.id);
                              handleEdit('gallery', image.id);
                            }}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium rounded-md px-3 py-1.5 text-xs border border-white/30 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 disabled:opacity-50 flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-300 text-red-300 hover:bg-red-300/10"
                            onClick={() => handleDelete('gallery', image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Messages Management */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {/* Email Status Messages */}
                  {emailStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        {emailMessage}
                      </div>
                    </motion.div>
                  )}
                  
                  {emailStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        {emailMessage}
                      </div>
                    </motion.div>
                  )}

                  {messages.map((message) => (
                    <Card key={message.id} className="bg-white/5 border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{message.title}</h3>
                              <Badge className={getPriorityColor(message.priority)}>
                                {message.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-sm text-white/70 mb-2">
                              <span>📅 {message.date}</span>
                            </div>
                            <p className="text-white/80 text-sm line-clamp-3">{message.content}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-300 text-blue-300 hover:bg-blue-300/10"
                              onClick={() => handleSendEmail(message.id)}
                              disabled={isSendingEmail}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/30 text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-white/30 text-white"
                              onClick={() => handleEdit('messages', message.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-300 hover:bg-red-300/10"
                              onClick={() => handleDelete('messages', message.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Subscribers Management */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Email Subscribers</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {subscribers.filter(s => s.isActive).length} Active
                    </Badge>
                  </div>
                  
                  {subscribers.map((subscriber) => (
                    <Card key={subscriber.id} className="bg-white/5 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-white font-medium">{subscriber.email}</h4>
                              <Badge className={subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {subscriber.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            {subscriber.name && (
                              <p className="text-white/70 text-sm">{subscriber.name}</p>
                            )}
                            <p className="text-white/60 text-xs">
                              Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-300 hover:bg-red-300/10"
                              onClick={() => handleDelete('subscribers', subscriber.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              </div>
              )}
            </div>
        </section>
      </main>

      <Footer />

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-gray-900">
                  {isAddingNew ? 'Add New' : 'Edit'} {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Events Form */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <Input
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <Input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                      <Input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <Input
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Special Event">Special Event</option>
                      <option value="Worship Service">Worship Service</option>
                      <option value="Special Service">Special Service</option>
                      <option value="Membership">Membership</option>
                      <option value="Youth">Youth</option>
                      <option value="Community Service">Community Service</option>
                      <option value="Adult Ministry">Adult Ministry</option>
                      <option value="Children's Ministry">Children's Ministry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="registrationRequired"
                      checked={eventForm.registrationRequired}
                      onChange={(e) => setEventForm(prev => ({ ...prev, registrationRequired: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="registrationRequired" className="text-sm font-medium text-gray-700">
                      Registration Required
                    </label>
                  </div>
                  
                  {/* Event Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Event Thumbnail</label>
                    
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEventThumbnailSelect}
                        className="hidden"
                        id="eventThumbnailUpload"
                      />
                      
                      {!eventThumbnailFile && (
                        <label htmlFor="eventThumbnailUpload" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <FileImage className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Click to upload event thumbnail
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </label>
                      )}
                      
                      {eventThumbnailFile && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <FileImage className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-gray-700">{eventThumbnailFile.name}</span>
                            <button
                              type="button"
                              onClick={() => setEventThumbnailFile(null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {eventUploadStatus === 'uploading' && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${eventUploadProgress}%` }}
                              />
                            </div>
                          )}
                          
                          {eventUploadStatus === 'success' && (
                            <div className="flex items-center justify-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Upload successful</span>
                            </div>
                          )}
                          
                          {eventUploadStatus === 'error' && (
                            <div className="flex items-center justify-center space-x-1 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">Upload failed</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* OneDrive Integration Placeholder */}
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => alert('OneDrive integration coming soon!')}
                        className="w-full"
                      >
                        <Cloud className="h-4 w-4 mr-2" />
                        Upload from OneDrive
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Stream Form */}
              {activeTab === 'livestream' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <Input
                      value={streamForm.title}
                      onChange={(e) => setStreamForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stream URL *</label>
                    <Input
                      value={streamForm.url}
                      onChange={(e) => setStreamForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                    <Input
                      value={streamForm.schedule}
                      onChange={(e) => setStreamForm(prev => ({ ...prev, schedule: e.target.value }))}
                      placeholder="e.g., Sundays 9:00 AM & 11:00 AM"
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isLive"
                      checked={streamForm.isLive}
                      onChange={(e) => setStreamForm(prev => ({ ...prev, isLive: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="isLive" className="text-sm font-medium text-gray-700">
                      Currently Live
                    </label>
                  </div>
                </div>
              )}

              {/* Gallery Form */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <Input
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload *</label>
                    
                    {/* File Upload Area */}
                    <div className="space-y-3">
                      {/* Device Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Upload from Device</p>
                          <p className="text-xs text-gray-500">Click to select images (max 10MB each, multiple files allowed)</p>
                        </label>
                      </div>
                      
                      {/* OneDrive Upload */}
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors space-y-2">
                        <Cloud className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-blue-600 mb-1">OneDrive (Connect · Upload · Choose)</p>
                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={handleOneDriveConnect}
                          >
                            <Cloud className="h-4 w-4 mr-2" />
                            Connect OneDrive
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={handleOneDriveUpload}
                          >
                            <Cloud className="h-4 w-4 mr-2" />
                            Upload from device to OneDrive
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={handleOneDriveBrowse}
                            disabled={oneDriveLoading}
                          >
                            {oneDriveLoading ? 'Loading...' : 'Choose from OneDrive'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={handleOneDriveStatus}
                          >
                            Check OneDrive status
                          </Button>
                          <p className="text-xs text-blue-200">
                            Status: {oneDriveStatus === 'connected' ? 'Connected' : oneDriveStatus === 'disconnected' ? 'Not connected' : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      
                      {/* URL Fallback */}
                      <div className="border-t pt-3">
                        <p className="text-xs text-gray-500 mb-2">Or enter image URL:</p>
                        <Input
                          value={galleryForm.url}
                          onChange={(e) => setGalleryForm(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://images.unsplash.com/..."
                          className="bg-gray-50 text-sm"
                        />
                      </div>
                      
                      {/* Upload Status */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-600 font-medium mb-2">
                            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                          </p>
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1 min-w-0">
                                  <FileImage className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCropImage(file, index)}
                                    className="text-blue-600 hover:text-blue-700 p-1"
                                    title="Adjust crop & focus"
                                  >
                                    <Crop className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {uploadStatus === 'uploading' && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <Input
                        type="date"
                        value={galleryForm.date}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Worship">Worship</option>
                        <option value="Fellowship">Fellowship</option>
                        <option value="Community">Community</option>
                        <option value="Youth">Youth</option>
                        <option value="Children">Children</option>
                        <option value="Events">Events</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Form */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <Input
                      value={messageForm.title}
                      onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                    <textarea
                      value={messageForm.content}
                      onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={6}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <Input
                        type="date"
                        value={messageForm.date}
                        onChange={(e) => setMessageForm(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={messageForm.priority}
                        onChange={(e) => setMessageForm(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? 'Add' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          if (cropImageUrl) {
            URL.revokeObjectURL(cropImageUrl);
            setCropImageUrl('');
          }
        }}
        imageUrl={cropImageUrl}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
