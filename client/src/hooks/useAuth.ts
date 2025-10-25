// Reference: Replit Auth Blueprint
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

// Mock user data for development
const TEST_USERS = {
  student: {
    id: 'test-student-123',
    name: 'Test Student',
    email: 'student@test.com',
    role: 'student',
    city: 'Lahore',
    classGrade: '10',
    board: 'FBISE',
    schoolId: 'test-school-123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestStudent'
  },
  admin: {
    id: 'test-admin-456',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'admin',
    schoolId: 'test-school-123',
    schoolName: 'Test School',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestAdmin'
  }
} as const;

export function useAuth() {
  const [isTestUser, setIsTestUser] = useState(false);
  
  // Check for test user on client side only
  useEffect(() => {
    const testUser = localStorage.getItem('test-user');
    if (testUser && (testUser === 'student' || testUser === 'admin')) {
      setIsTestUser(true);
    }
  }, []);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Return test user data if in development mode and test user is set
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development' || isTestUser) {
        const testUser = localStorage.getItem('test-user');
        if (testUser === 'student') return TEST_USERS.student as User;
        if (testUser === 'admin') return TEST_USERS.admin as User;
      }
      // Normal API call would go here
      const response = await fetch('/api/auth/user');
      if (!response.ok) throw new Error('Not authenticated');
      return response.json();
    },
  });

  // Logout function that also clears test user
  const logout = () => {
    localStorage.removeItem('test-user');
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    isTestUser,
  };
}
