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

  const handleOneDriveUpload = async () => {
    try {
      // Simple OneDrive integration using Microsoft Graph API
      // This is a basic implementation - in production you'd need proper OAuth flow
      
      const clientId = 'your-microsoft-app-client-id'; // Would be from environment variables
      const redirectUri = window.location.origin + '/onedrive-callback';
      
      // For demo purposes, we'll show a file picker dialog
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.multiple = false;
      
      fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setSelectedFile(file);
          setUploadStatus('idle');
          
          // In a real implementation, you would:
          // 1. Authenticate with Microsoft Graph
          // 2. Upload to OneDrive
          // 3. Get the shareable URL
          // 4. Set that URL in the gallery form
          
          alert(`Selected: ${file.name}\n\nFor full OneDrive integration:\n1. Register app with Microsoft\n2. Implement OAuth flow\n3. Use Microsoft Graph API to upload\n4. Get shareable URL`);
        }
      };
      
      fileInput.click();
      
    } catch (error) {
      console.error('OneDrive upload error:', error);
      alert('OneDrive integration requires Microsoft app registration and OAuth setup.');
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
        const token = localStorage.getItem('adminAuth') === 'true' ? 'admin' : '';
        const response = await fetch(`/api/admin/${type}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Refresh data from database
          await fetchData();
        } else {
          console.error('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
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
    setSelectedFile(null);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.map((image) => (
                    <Card key={image.id} className="bg-white/5 border-white/20 overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-white font-semibold mb-2">{image.title}</h3>
                        <div className="flex justify-between items-center text-sm text-white/70 mb-3">
                          <span>📅 {image.date}</span>
                          <Badge className="bg-blue-100 text-blue-800">{image.category}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-white/30 text-white flex-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              alert('Edit button clicked for: ' + image.id);
                              handleEdit('gallery', image.id);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
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
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Cloud className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-blue-600 mb-1">Upload from OneDrive</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={handleOneDriveUpload}
                        >
                          <Cloud className="h-4 w-4 mr-2" />
                          Connect OneDrive
                        </Button>
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
