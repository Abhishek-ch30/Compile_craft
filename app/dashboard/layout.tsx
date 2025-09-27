"use client"
import React, { useState, createContext, useContext } from 'react'
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { TotalUsageContext } from '../(context)/TotalUsageContext';
import { UserSubscriptionContext } from '../(context)/UserSubscriptionContext';
import { UpdateCreditUsageContext } from '../(context)/UpdateCreditUsageContext';
import { LiveblocksProvider } from '@/liveblocks.config'; // <-- IMPORT THIS

// Create context for document info
const DocumentContext = createContext<{
  documentId?: string;
  currentContent?: string;
  onVersionSelect?: (content: string, version: number) => void;
  setDocumentInfo: (info: { documentId?: string; currentContent?: string; onVersionSelect?: (content: string, version: number) => void }) => void;
}>({
  setDocumentInfo: () => {}
});

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [totalUsage, setTotalUsage] = useState<number>(0);
    const [userSubscription, setUserSubscription] = useState<boolean>(false);
    const [updateCreditUsage, setUpdateCreditUsage] = useState<number | null>(null);
    
    // Document context state
    const [documentInfo, setDocumentInfo] = useState<{
      documentId?: string;
      currentContent?: string;
      onVersionSelect?: (content: string, version: number) => void;
    }>({});

  return (
    <TotalUsageContext.Provider value={{totalUsage,setTotalUsage}}>
      <UserSubscriptionContext.Provider value={{userSubscription,setUserSubscription}}>
        <UpdateCreditUsageContext.Provider value={{updateCreditUsage,setUpdateCreditUsage}}>
          <DocumentContext.Provider value={{...documentInfo, setDocumentInfo}}>
            {/* Wrap the entire dashboard in the LiveblocksProvider */}
            <LiveblocksProvider>
              <div className='bg-slate-900 min-h-screen'>
                  <div className='md:w-64 hidden md:block fixed'>
                      <SideNav 
                        documentId={documentInfo.documentId}
                        currentContent={documentInfo.currentContent}
                        onVersionSelect={documentInfo.onVersionSelect}
                      />
                  </div>
                  <div className='md:ml-64'>
                    <Header/>
                  {children}
                  </div>
              </div>
            </LiveblocksProvider>
          </DocumentContext.Provider>
    </UpdateCreditUsageContext.Provider>
    </UserSubscriptionContext.Provider>
    </TotalUsageContext.Provider>
  )
}

export default layout
export { DocumentContext }