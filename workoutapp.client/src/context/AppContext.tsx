import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AppContextType {
    users: User[];
    fetchUsers: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/user');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AppContext.Provider value={{ users, fetchUsers }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};