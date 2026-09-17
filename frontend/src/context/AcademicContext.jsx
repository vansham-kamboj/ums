import React, { createContext, useContext, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const AcademicContext = createContext(null);

const defaultAcademicData = {
  sessions: [],
  departments: [],
  programTypes: [],
  programs: [],
  courses: [],
  divisions: [],
  batches: [],
  subjectTypes: [],
  subjects: [],
  enrollmentSeats: [],
  classTimings: [],
  employees: [],
};

export function AcademicProvider({ children }) {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: academicData = defaultAcademicData, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['academicData'],
    queryFn: async () => {
      const [
        sRes, dRes, ptRes, pRes, cRes, divRes, bRes, stRes, subRes, seatRes, ctRes, empRes
      ] = await Promise.all([
        api.get('/academic/sessions').catch(() => null),
        api.get('/academic/departments').catch(() => null),
        api.get('/academic/program-types').catch(() => null),
        api.get('/academic/programs').catch(() => null),
        api.get('/academic/courses').catch(() => null),
        api.get('/academic/divisions').catch(() => null),
        api.get('/academic/batches').catch(() => null),
        api.get('/academic/subject-types').catch(() => null),
        api.get('/academic/subjects').catch(() => null),
        api.get('/academic/enrollment-seats').catch(() => null),
        api.get('/academic/class-timings').catch(() => null),
        api.get('/employees').catch(() => null),
      ]);

      const formatList = (res) => (res && Array.isArray(res.data?.data)) ? res.data.data : ((res && Array.isArray(res.data)) ? res.data : []);
      const empRaw = formatList(empRes);
      const formattedEmployees = empRaw.map(e => ({
        id: e.id,
        name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.email || 'Employee'
      }));

      return {
        sessions: formatList(sRes),
        departments: formatList(dRes),
        programTypes: formatList(ptRes),
        programs: formatList(pRes),
        courses: formatList(cRes),
        divisions: formatList(divRes),
        batches: formatList(bRes),
        subjectTypes: formatList(stRes),
        subjects: formatList(subRes),
        enrollmentSeats: formatList(seatRes),
        classTimings: formatList(ctRes),
        employees: formattedEmployees,
      };
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes cache staleTime
  });

  const loadAllAcademicData = useCallback((force = false) => {
    if (force) {
      refetch();
    }
  }, [refetch]);

  // Refresh only a specific entity from DB when changes happen
  const refreshEntity = useCallback(async (key, endpoint) => {
    try {
      const res = await api.get(endpoint);
      const newList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      queryClient.setQueryData(['academicData'], (prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: newList };
      });
      queryClient.invalidateQueries({ queryKey: ['genericList'] });
    } catch (err) {
      console.error(`Failed to refresh entity ${key}:`, err);
    }
  }, [queryClient]);

  // In-memory local state mutation helpers
  const updateLocalEntity = useCallback((key, action, item) => {
    queryClient.setQueryData(['academicData'], (prev) => {
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
    ...academicData,
    loading,
    initialLoaded: !loading && !!academicData,
    error: error ? 'Failed to load academic setup data' : null,
    loadAllAcademicData,
    refreshEntity,
    updateLocalEntity,
    activeSession: academicData.sessions?.find(s => s.isActive || s.isDefault) || academicData.sessions?.[0] || null,
  };

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
}
