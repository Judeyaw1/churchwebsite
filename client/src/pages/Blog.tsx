import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicPageLayout from '@/components/PublicPageLayout';
import PublicPageHero from '@/components/PublicPageHero';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
  excerpt?: string;
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch blog posts from database
  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/blog?t=${Date.now()}`);
      if (response.ok) {
        const postsData = await response.json();
        setBlogPosts(postsData);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <PublicPageLayout>
      <PublicPageHero
        title="Church Blog"
        description="Stay connected with our community through inspiring stories, updates, and reflections from our church family."
        align="center"
      />

        <section ref={ref} className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading blog posts...</p>
              </div>
            )}

            {/* Blog Posts Grid */}
            {!isLoading && !selectedPost && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {blogPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
                      onClick={() => setSelectedPost(post)}
                    >
                      {/* Blog Image */}
                      {post.image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-contain bg-black transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-white mb-2 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-white/70 gap-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(post.publishedAt)}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-white/80 text-sm mb-4 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-white/30 text-white hover:bg-white/10"
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Single Post View */}
            {!isLoading && selectedPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <Button
                  variant="outline"
                  className="mb-6 border-white/30 text-white hover:bg-white/10"
                  onClick={() => setSelectedPost(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>

                <Card className="rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_120px_rgba(0,0,0,0.32)]">
                  {selectedPost.image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={selectedPost.image}
                        alt={selectedPost.title}
                        className="w-full h-full object-contain bg-black"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-3xl text-white mb-4">
                      {selectedPost.title}
                    </CardTitle>
                    <div className="flex items-center text-white/70 gap-6">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        {selectedPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        {formatDate(selectedPost.publishedAt)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div 
                      className="prose prose-invert max-w-none text-white/90 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br />') }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* No Posts */}
            {!isLoading && blogPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Calendar className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
                <p className="text-white/80">
                  Check back soon for updates and stories from our church community.
                </p>
              </motion.div>
            )}
          </div>
        </section>
    </PublicPageLayout>
  );
}
