import { createContext } from "react";

interface UserSubscriptionContextType {
    userSubscription: boolean;
    setUserSubscription: (subscription: boolean) => void;
}

export const UserSubscriptionContext = createContext<UserSubscriptionContextType>({
    userSubscription: false,
    setUserSubscription: () => {}
});