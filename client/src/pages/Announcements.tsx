import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Megaphone } from 'lucide-react';
import PublicPageLayout from '@/components/PublicPageLayout';
import PublicPageHero from '@/components/PublicPageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

const getPriorityColor = (priority: Announcement['priority']) => {
  switch (priority) {
    case 'high':
      return 'border border-white/20 bg-white text-black';
    case 'medium':
      return 'border border-white/20 bg-white/15 text-white';
    case 'low':
      return 'border border-white/20 bg-black/30 text-white';
    default:
      return 'border border-white/20 bg-white/10 text-white';
  }
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/messages');
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <PublicPageLayout>
      <PublicPageHero
        title="Church Announcements"
        description="Stay up to date with important news, events, and ministry updates."
        align="center"
      />

        <section className="py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading announcements...</p>
              </div>
            ) : announcements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Megaphone className="h-4 w-4 text-white/80" />
                            {announcement.title}
                          </CardTitle>
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80 mb-4 whitespace-pre-line">
                          {announcement.content}
                        </p>
                        <div className="flex items-center text-white/60 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          {announcement.date}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-white/70">
                No announcements yet.
              </div>
            )}
          </div>
        </section>
    </PublicPageLayout>
  );
}
