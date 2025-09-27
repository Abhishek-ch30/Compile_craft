// File: components/CollaborativeEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import TiptapCollabProvider from '@liveblocks/yjs';
import * as Y from 'yjs';
import { useRoom, useSelf } from '../liveblocks.config';

interface CollaborativeEditorProps {
    document: Y.Doc;
    initialContent: string;
}

export function CollaborativeEditor({ document, initialContent }: CollaborativeEditorProps) {
    const room = useRoom();
    const userInfo = useSelf();
    const [provider, setProvider] = useState<any>(null);

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px]',
            },
        },
        extensions: [
            StarterKit.configure({ history: false }),
            Collaboration.configure({ document }),
            ...(provider ? [CollaborationCursor.configure({
                provider,
                user: {
                    name: userInfo?.info?.name ?? 'Anonymous',
                    color: userInfo?.info?.color ?? '#f783ac',
                },
            })] : []),
        ],
    }, [provider]);

    useEffect(() => {
        if (!room || !document) return;
        const newProvider = new TiptapCollabProvider(room, document);
        setProvider(newProvider);
        return () => newProvider?.destroy();
    }, [room, document]);

    useEffect(() => {
        if (editor && initialContent && editor.isEmpty) {
            editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);

    return <EditorContent editor={editor} />;
}
