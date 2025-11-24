import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface ContentItem {
  id: string;
  key: string;
  type: 'text' | 'image' | 'link';
  value: string;
  label: string;
  section: string;
  created_at?: string;
  updated_at?: string;
}

interface ContentContextType {
  content: Record<string, ContentItem>;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  updateContent: (key: string, value: string) => Promise<void>;
  createContent: (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteContent: (key: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('content_items')
        .select('*')
        .order('section', { ascending: true });

      if (fetchError) throw fetchError;

      const contentMap: Record<string, ContentItem> = {};
      data?.forEach((item) => {
        contentMap[item.key] = item;
      });
      setContent(contentMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (key: string, value: string) => {
    try {
      const { error: updateError } = await supabase
        .from('content_items')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (updateError) throw updateError;
      await fetchContent();
    } catch (err) {
      throw err;
    }
  };

  const createContent = async (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error: createError } = await supabase
        .from('content_items')
        .insert([item]);

      if (createError) throw createError;
      await fetchContent();
    } catch (err) {
      throw err;
    }
  };

  const deleteContent = async (key: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('content_items')
        .delete()
        .eq('key', key);

      if (deleteError) throw deleteError;
      await fetchContent();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchContent();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_items'
        },
        () => {
          // Refresh content when any change occurs
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        refreshContent: fetchContent,
        updateContent,
        createContent,
        deleteContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Helper function to get content value by key
export function useContentValue(key: string, defaultValue: string = ''): string {
  const { content } = useContent();
  return content[key]?.value || defaultValue;
}

