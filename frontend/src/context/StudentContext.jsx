import React, { createContext, useContext, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const StudentContext = createContext(null);

const defaultStudentData = {
  students: [],
  registrations: [],
  enquiries: [],
  studentGroups: [],
  alumni: [],
  guardians: [],
};

export function StudentProvider({ children }) {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: studentData = defaultStudentData, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['studentData'],
    queryFn: async () => {
      const [stRes, regRes, enqRes, grpRes, almRes, gdnRes] = await Promise.all([
        api.get('/students').catch(() => null),
        api.get('/students/registrations').catch(() => null),
        api.get('/students/enquiries').catch(() => null),
        api.get('/students/groups').catch(() => null),
        api.get('/students/alumni').catch(() => null),
        api.get('/guardians').catch(() => null),
      ]);

      const formatList = (res) => (res && Array.isArray(res.data?.data)) ? res.data.data : ((res && Array.isArray(res.data)) ? res.data : []);

      return {
        students: formatList(stRes),
        registrations: formatList(regRes),
        enquiries: formatList(enqRes),
        studentGroups: formatList(grpRes),
        alumni: formatList(almRes),
        guardians: formatList(gdnRes),
      };
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes cache staleTime
  });

  const loadAllStudentData = useCallback((force = false) => {
    if (force) {
      refetch();
    }
  }, [refetch]);

  // Refresh only a specific entity from DB when changes happen
  const refreshStudentEntity = useCallback(async (key, endpoint) => {
    try {
      const res = await api.get(endpoint);
      const newList = (res && Array.isArray(res.data?.data)) ? res.data.data : ((res && Array.isArray(res.data)) ? res.data : []);
      queryClient.setQueryData(['studentData'], (prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: newList };
      });
      queryClient.invalidateQueries({ queryKey: ['genericList'] });
    } catch (err) {
      console.error(`Failed to refresh student entity ${key}:`, err);
    }
  }, [queryClient]);

  // In-memory local state mutation helpers
  const updateLocalStudentEntity = useCallback((key, action, item) => {
    queryClient.setQueryData(['studentData'], (prev) => {
      if (!prev) return prev;
      const currentList = prev[key] || [];
      let updatedList = [];
      if (action === 'ADD') {
        updatedList = [item, ...currentList];
      } else if (action === 'UPDATE') {
        updatedList = currentList.map(i => i.id === item.id ? { ...i, ...item } : i);
      } else if (action === 'DELETE') {
        updatedList = currentList.filter(i => i.id !== item.id);
      } else {
        updatedList = currentList;
      }
      return { ...prev, [key]: updatedList };
    });
    queryClient.invalidateQueries({ queryKey: ['genericList'] });
  }, [queryClient]);

  const value = {
    ...studentData,
    loading,
    initialLoaded: !loading && !!studentData,
    error: error ? 'Failed to load student data' : null,
    loadAllStudentData,
    refreshStudentEntity,
    updateLocalStudentEntity,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
