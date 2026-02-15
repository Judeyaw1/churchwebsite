// Data service to sync admin dashboard data with website components
// This uses localStorage for persistence - in production, this would be replaced with API calls

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  maxAttendees?: number;
  currentAttendees?: number;
  registrationRequired: boolean;
  image?: string;
}

export interface LiveStream {
  id: string;
  title: string;
  url: string;
  schedule: string;
  isLive: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  category: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

// Default data for initial setup
const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Christmas Concert',
    date: 'Dec 15, 2024',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'Join us for an evening of beautiful Christmas music featuring our choir, orchestra, and special guest performers. This annual tradition brings the community together to celebrate the joy of the season.',
    category: 'Special Event',
    maxAttendees: 300,
    currentAttendees: 245,
    registrationRequired: false,
    image: undefined
  },
  {
    id: '2',
    title: 'Family Service',
    date: 'Dec 22, 2024',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'A special service designed for families with children of all ages. Interactive worship, storytelling, and activities that engage both parents and children.',
    category: 'Worship Service',
    registrationRequired: false,
    image: undefined
  },
  {
    id: '3',
    title: 'Christmas Eve Service',
    date: 'Dec 24, 2024',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'Join us for our traditional Christmas Eve candlelight service celebrating the birth of Christ. Music, scripture, and the lighting of candles.',
    category: 'Worship Service',
    registrationRequired: false,
    image: undefined
  },
  {
    id: '4',
    title: 'New Year Prayer Service',
    date: 'Jan 1, 2025',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Start the new year with prayer, reflection, and fellowship. Join us as we seek God\'s guidance for the year ahead.',
    category: 'Worship Service',
    registrationRequired: false,
    image: undefined
  },
  {
    id: '5',
    title: 'Youth Winter Retreat',
    date: 'Jan 15-17, 2025',
    time: '5:00 PM',
    location: 'Camp Retreat Center',
    description: 'A weekend getaway for youth to grow in faith, build relationships, and have fun in a beautiful outdoor setting.',
    category: 'Youth',
    maxAttendees: 50,
    currentAttendees: 32,
    registrationRequired: true,
    image: undefined
  },
  {
    id: '6',
    title: 'Community Food Drive',
    date: 'Jan 20, 2025',
    time: '9:00 AM - 2:00 PM',
    location: 'Church Parking Lot',
    description: 'Help us collect food donations for local families in need. Drop off non-perishable items and join us in serving our community.',
    category: 'Community Service',
    registrationRequired: false,
    image: undefined
  },
  {
    id: '7',
    title: 'Marriage Enrichment Workshop',
    date: 'Feb 8, 2025',
    time: '9:00 AM - 3:00 PM',
    location: 'Conference Room',
    description: 'Strengthen your marriage with practical tools, biblical principles, and fellowship with other couples. Led by experienced marriage counselors.',
    category: 'Adult Ministry',
    maxAttendees: 20,
    currentAttendees: 15,
    registrationRequired: true,
    image: undefined
  },
  {
    id: '8',
    title: 'Children\'s Easter Program',
    date: 'Mar 30, 2025',
    time: '6:00 PM',
    location: 'Main Sanctuary',
    description: 'Our children will present the Easter story through music, drama, and scripture. A wonderful celebration of Christ\'s resurrection.',
    category: 'Children\'s Ministry',
    registrationRequired: false,
    image: undefined
  }
];

const defaultLiveStreams: LiveStream[] = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    url: 'https://us06web.zoom.us/j/83673620030?pwd=wTkJbWmleCKz1ka6qS3UZQfwUwVKa0.1',
    schedule: 'Sundays 9:00 AM & 11:00 AM',
    isLive: false
  },
  {
    id: '2',
    title: 'Midweek Bible Study',
    url: 'https://us06web.zoom.us/j/83673620030?pwd=wTkJbWmleCKz1ka6qS3UZQfwUwVKa0.1',
    schedule: 'Wednesdays 7:00 PM',
    isLive: false
  }
];

// Use an empty default gallery to avoid AI/placeholder images; real images come from API
const defaultGalleryImages: GalleryImage[] = [];

const defaultMessages: Message[] = [
  {
    id: '1',
    title: 'Welcome New Members',
    content: 'A warm welcome to all our new members who joined us this month. We\'re excited to have you as part of our church family.',
    date: '2024-11-01',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Volunteer Opportunity',
    content: 'We need volunteers for the upcoming food drive. Please contact the church office if you can help.',
    date: '2024-10-28',
    priority: 'medium'
  }
];

// Storage keys
const STORAGE_KEYS = {
  EVENTS: 'church_events',
  LIVE_STREAMS: 'church_live_streams',
  GALLERY_IMAGES: 'church_gallery_images',
  MESSAGES: 'church_messages'
};

// Helper functions
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Data service functions
export const dataService = {
  // Events
  getEvents: (): Event[] => {
    return loadFromStorage(STORAGE_KEYS.EVENTS, defaultEvents);
  },

  saveEvents: (events: Event[]): void => {
    saveToStorage(STORAGE_KEYS.EVENTS, events);
  },

  addEvent: (event: Event): void => {
    const events = dataService.getEvents();
    events.push(event);
    dataService.saveEvents(events);
  },

  updateEvent: (id: string, updatedEvent: Event): void => {
    const events = dataService.getEvents();
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
      events[index] = updatedEvent;
      dataService.saveEvents(events);
    }
  },

  deleteEvent: (id: string): void => {
    const events = dataService.getEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    dataService.saveEvents(filteredEvents);
  },

  // Live Streams
  getLiveStreams: (): LiveStream[] => {
    return loadFromStorage(STORAGE_KEYS.LIVE_STREAMS, defaultLiveStreams);
  },

  saveLiveStreams: (streams: LiveStream[]): void => {
    saveToStorage(STORAGE_KEYS.LIVE_STREAMS, streams);
  },

  addLiveStream: (stream: LiveStream): void => {
    const streams = dataService.getLiveStreams();
    streams.push(stream);
    dataService.saveLiveStreams(streams);
  },

  updateLiveStream: (id: string, updatedStream: LiveStream): void => {
    const streams = dataService.getLiveStreams();
    const index = streams.findIndex(stream => stream.id === id);
    if (index !== -1) {
      streams[index] = updatedStream;
      dataService.saveLiveStreams(streams);
    }
  },

  deleteLiveStream: (id: string): void => {
    const streams = dataService.getLiveStreams();
    const filteredStreams = streams.filter(stream => stream.id !== id);
    dataService.saveLiveStreams(filteredStreams);
  },

  // Gallery Images
  getGalleryImages: (): GalleryImage[] => {
    return loadFromStorage(STORAGE_KEYS.GALLERY_IMAGES, defaultGalleryImages);
  },

  saveGalleryImages: (images: GalleryImage[]): void => {
    saveToStorage(STORAGE_KEYS.GALLERY_IMAGES, images);
  },

  addGalleryImage: (image: GalleryImage): void => {
    const images = dataService.getGalleryImages();
    images.push(image);
    dataService.saveGalleryImages(images);
  },

  updateGalleryImage: (id: string, updatedImage: GalleryImage): void => {
    const images = dataService.getGalleryImages();
    const index = images.findIndex(image => image.id === id);
    if (index !== -1) {
      images[index] = updatedImage;
      dataService.saveGalleryImages(images);
    }
  },

  deleteGalleryImage: (id: string): void => {
    const images = dataService.getGalleryImages();
    const filteredImages = images.filter(image => image.id !== id);
    dataService.saveGalleryImages(filteredImages);
  },

  // Messages
  getMessages: (): Message[] => {
    return loadFromStorage(STORAGE_KEYS.MESSAGES, defaultMessages);
  },

  saveMessages: (messages: Message[]): void => {
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  },

  addMessage: (message: Message): void => {
    const messages = dataService.getMessages();
    messages.push(message);
    dataService.saveMessages(messages);
  },

  updateMessage: (id: string, updatedMessage: Message): void => {
    const messages = dataService.getMessages();
    const index = messages.findIndex(message => message.id === id);
    if (index !== -1) {
      messages[index] = updatedMessage;
      dataService.saveMessages(messages);
    }
  },

  deleteMessage: (id: string): void => {
    const messages = dataService.getMessages();
    const filteredMessages = messages.filter(message => message.id !== id);
    dataService.saveMessages(filteredMessages);
  },

  // Utility functions
  getUpcomingEvents: (limit: number = 3): Event[] => {
    const events = dataService.getEvents();
    return events
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  },

  getCurrentLiveStream: (): LiveStream | null => {
    const streams = dataService.getLiveStreams();
    return streams.find(stream => stream.isLive) || null;
  }
};

// Initialize default data if not exists
export const initializeData = (): void => {
  // Only initialize if no data exists
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    dataService.saveEvents(defaultEvents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LIVE_STREAMS)) {
    dataService.saveLiveStreams(defaultLiveStreams);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGES)) {
    dataService.saveGalleryImages(defaultGalleryImages);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    dataService.saveMessages(defaultMessages);
  }
};
