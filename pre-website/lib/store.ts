import { create } from 'zustand';

interface StoreState {
    locale: 'de' | 'en';
    mobileMenuOpen: boolean;
    waitlistEmail: string;
    waitlistSubmitting: boolean;
    waitlistSuccess: boolean;
    waitlistError: string | null;
    setLocale: (locale: 'de' | 'en') => void;
    toggleMobileMenu: () => void;
    setWaitlistEmail: (email: string) => void;
    submitWaitlist: () => Promise<void>;
    resetWaitlist: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
    locale: 'de',
    mobileMenuOpen: false,
    waitlistEmail: '',
    waitlistSubmitting: false,
    waitlistSuccess: false,
    waitlistError: null,
    
    setLocale: (locale) => set({ locale }),
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    setWaitlistEmail: (email) => set({ waitlistEmail: email }),
    
    submitWaitlist: async () => {
        const { waitlistEmail, locale } = get();
        
        if (!waitlistEmail) {
            set({ waitlistError: 'Email is required' });
            return;
        }
        
        set({ waitlistSubmitting: true, waitlistError: null });
        
        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: waitlistEmail, locale }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit waitlist');
            }
            
            set({ 
                waitlistSubmitting: false, 
                waitlistSuccess: true,
                waitlistEmail: ''
            });
        } catch (error: any) {
            set({ 
                waitlistSubmitting: false, 
                waitlistError: error.message || 'An error occurred' 
            });
        }
    },
    
    resetWaitlist: () => set({
        waitlistEmail: '',
        waitlistSubmitting: false,
        waitlistSuccess: false,
        waitlistError: null,
    }),
}));
