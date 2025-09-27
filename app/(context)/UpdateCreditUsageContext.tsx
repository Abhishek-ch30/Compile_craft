import { createContext } from "react";

interface UpdateCreditUsageContextType {
    updateCreditUsage: number | null;
    setUpdateCreditUsage: (update: number | null) => void;
}

export const UpdateCreditUsageContext = createContext<UpdateCreditUsageContextType>({
    updateCreditUsage: null,
    setUpdateCreditUsage: () => {}
});