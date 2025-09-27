import { createContext } from "react";

interface TotalUsageContextType {
    totalUsage: number;
    setTotalUsage: (usage: number) => void;
}

export const TotalUsageContext = createContext<TotalUsageContextType>({
    totalUsage: 0,
    setTotalUsage: () => {}
});