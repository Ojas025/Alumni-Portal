import { userConnectionProps } from "@/components/Pages/Home/UserConnectionCard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    batch: string;
    dob: string;
    linkedin: string;
    github: string;
    profileImageURL?: string;
    skills: string[];
    interests: string[];
    bio?: string;
    jobDetails?: {
        company?: string;
        title?: string;
    };
    department: string; 
    location: string;
    previousCompanies?: string[];
    internships?: string[];
    availableForMentorship: boolean;
    languages: string[];
    projects: {
        title: string;
        url: string;
        description: string;
        technologiesUsed: string[]
    }[];
    connections: userConnectionProps[];
};

export interface UserState {
    user: User | null;
    loading: boolean;
    isFetched: boolean;
}

const initialState: UserState = {
    user: null,
    loading: false,
    isFetched: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.loading = false;
            state.isFetched = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
            state.isFetched = true;
        },
        updateUser: (state, action: PayloadAction<User>) => {
            if (state.user) state.user = { ...state.user, ...action.payload };
        },
    }
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;