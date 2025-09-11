'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Send, MoreHorizontal, Copy, Edit, Trash2 } from 'lucide-react';

import apiClient from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatInterfaceProps {
  workspaceId: string;
}

// API Functions
const fetchChatHistory = async (workspaceId: string): Promise<ChatMessage[]> => {
  const { data } = await apiClient.get(`/chat/${workspaceId}/history`);
  return data;
};

const postChatMessage = async ({ workspaceId, message }: { workspaceId: string; message: string }): Promise<ChatMessage> => {
  const { data } = await apiClient.post(`/api/v1/chat/${workspaceId}`, { message });
  return data;
};

// Loading Skeleton Component
const MessagesSkeleton = () => (
    <div className="space-y-4">
        <div className="flex items-end gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-lg" />
        </div>
        <div className="flex items-end justify-end gap-2">
            <Skeleton className="h-10 w-1/2 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-end gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-16 w-4/5 rounded-lg" />
        </div>
    </div>
);

export default function ChatInterface({ workspaceId }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const scrollAreaViewport = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: isHistoryLoading } = useQuery<ChatMessage[]>({ 
    queryKey: ['chatHistory', workspaceId], 
    queryFn: () => fetchChatHistory(workspaceId),
    enabled: !!workspaceId && !!user,
  });

  const mutation = useMutation<ChatMessage, Error, { workspaceId: string; message: string }>({ 
      mutationFn: postChatMessage,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chatHistory', workspaceId] });
      }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    mutation.mutate({ workspaceId, message: inputMessage });
    setInputMessage('');
  };

  // Auto-scroll to bottom
  useEffect(() => {
    const viewport = scrollAreaViewport.current;
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, mutation.isPending]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chat</CardTitle>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Copiar Conversa</DropdownMenuItem>
                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar Título</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Deletar Conversa</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" viewportRef={scrollAreaViewport}>
            <div className="p-4 space-y-4">
            {isHistoryLoading ? (
                <MessagesSkeleton />
            ) : (
                messages?.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                    'flex items-end gap-2',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                >
                    {msg.role === 'assistant' && <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">IA</div>}
                    <div
                    className={cn(
                        'max-w-[75%] rounded-lg p-3',
                        msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                    >
                        {msg.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            msg.content
                        )}
                    </div>
                    {msg.role === 'user' && <div className="h-8 w-8 rounded-full bg-muted-foreground text-background flex items-center justify-center text-sm font-bold">{user?.email?.charAt(0).toUpperCase()}</div>}
                </div>
                ))
            )}
            {mutation.isPending && (
                <div className="flex items-end gap-2 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">IA</div>
                    <div className="bg-muted rounded-lg p-3">
                        <p className='text-sm animate-pulse'>Pensando...</p>
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Faça uma pergunta sobre seus documentos..."
            className="flex-1"
            autoComplete="off"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={mutation.isPending}
          />
          <Button type="submit" size="icon" disabled={mutation.isPending}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
