import React, { useEffect, useRef, useState } from 'react'
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollaborativeEditor } from '@/components/CollaborativeEditor';
import * as Y from 'yjs';

interface Props {
  aiOutput: string;
  roomId: string;
}

function OutputSection({ aiOutput, roomId }: Props) {
  const hasSetInitialContent = useRef(false);
  const [document] = useState(() => new Y.Doc());

  // Effect to handle setting initial content when AI output changes
  useEffect(() => {
    if (aiOutput && !hasSetInitialContent.current) {
      hasSetInitialContent.current = true;
    }
  }, [aiOutput]);

  return (
    <div className='bg-white shadow-lg border rounded-lg'>
      {/* AI Generated Result Section - Only show if there's content */}
      {aiOutput && (
        <>
          <div className='flex justify-between items-center p-5'>
            <h2 className='font-medium text-lg'>Your Result</h2>
            <Button className='flex gap-2'
            onClick={()=>navigator.clipboard.writeText(aiOutput)}
            ><Copy className='w-4 h-4'/> Copy </Button>
          </div>
          <div className='p-5'>
            <div className='bg-gray-50 p-4 rounded-lg border mb-5'>
              <pre className='whitespace-pre-wrap text-sm'>{aiOutput}</pre>
            </div>
          </div>
        </>
      )}
      
      {/* Collaborative Editor Section */}
      <div className={aiOutput ? 'border-t' : ''}>
        <div className='p-5 pb-3'>
          <h3 className='font-medium text-lg'>Collaborative Editor</h3>
          <p className='text-sm text-gray-600'>
            {aiOutput 
              ? 'Edit and collaborate with others in real-time' 
              : 'Generate content above to start collaborating'
            }
          </p>
        </div>
        <div className='px-5 pb-5'>
          <CollaborativeEditor 
            document={document}
            initialContent={aiOutput}
          />
        </div>
      </div>
    </div>
  )
}

export default OutputSection
