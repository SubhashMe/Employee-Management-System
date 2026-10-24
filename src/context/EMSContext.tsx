import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Employee, LeaveRequest, PerformanceGoal, GrievanceTicket, ExitProcess, EMSNotification } from '../types/ems';
import {
  initialEmployees,
  initialLeaves,
  initialGoals,
  initialGrievances,
  initialExits,
  initialNotifications
} from '../data/mockData';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Employee' | 'Leave' | 'Grievance' | 'Goal' | 'Exit';
  targetTab: string;
  badge?: string;
}

interface EMSContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Employees
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Leaves
  leaves: LeaveRequest[];
  addLeave: (leave: Omit<LeaveRequest, 'id' | 'appliedOn'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected' | 'Pending') => void;

  // Goals
  goals: PerformanceGoal[];
  addGoal: (goal: Omit<PerformanceGoal, 'id'>) => void;
  updateGoalProgress: (id: string, progress: number) => void;

  // Grievances
  grievances: GrievanceTicket[];
  addGrievance: (ticket: Omit<GrievanceTicket, 'id' | 'ticketNumber' | 'submittedDate'>) => void;
  resolveGrievance: (id: string, resolutionNote: string) => void;

  // Exits
  exits: ExitProcess[];
  updateExitStatus: (id: string, status: 'Initiated' | 'In Review' | 'Cleared') => void;

  // Notifications
  notifications: EMSNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadNotificationsCount: number;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResultItem[];
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
}

const EMSContext = createContext<EMSContextType | undefined>(undefined);

export const EMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [goals, setGoals] = useState<PerformanceGoal[]>(initialGoals);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(initialGrievances);
  const [exits, setExits] = useState<ExitProcess[]>(initialExits);
  const [notifications, setNotifications] = useState<EMSNotification[]>(initialNotifications);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Employee CRUD
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `EMP-${1000 + employees.length + 1}`;
    const newEmp: Employee = {
      ...empData,
      id: newId,
    };
    setEmployees(prev => [newEmp, ...prev]);

    // Push notification
    const newNotif: EMSNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Employee Added',
      description: `${newEmp.name} registered under ${newEmp.department} department.`,
      time: 'Just now',
      type: 'system',
      read: false,
      targetModule: 'onboarding',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updatedFields } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  // Leaves
  const addLeave = (leaveData: Omit<LeaveRequest, 'id' | 'appliedOn'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `LEV-${200 + leaves.length + 1}`,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setLeaves(prev => [newLeave, ...prev]);

    // Push notification
    const newNotif: EMSNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Leave Request Submitted',
      description: `${newLeave.employeeName} requested ${newLeave.days} day(s) ${newLeave.type}.`,
      time: 'Just now',
      type: 'leave',
      read: false,
      targetModule: 'attendance',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected' | 'Pending') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  // Goals
  const addGoal = (goalData: Omit<PerformanceGoal, 'id'>) => {
    const newGoal: PerformanceGoal = {
      ...goalData,
      id: `GOAL-${300 + goals.length + 1}`,
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const currentProgress = Math.min(100, Math.max(0, progress));
      let status: PerformanceGoal['status'] = 'On Track';
      if (currentProgress >= 90) status = 'Exceeded';
      else if (currentProgress < 50) status = 'Needs Improvement';
      return { ...g, currentProgress, status };
    }));
  };

  // Grievances
  const addGrievance = (ticketData: Omit<GrievanceTicket, 'id' | 'ticketNumber' | 'submittedDate'>) => {
    const newTicket: GrievanceTicket = {
      ...ticketData,
      id: `GRV-${500 + grievances.length + 1}`,
      ticketNumber: `GRV-IN-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Under Investigation',
    };
    setGrievances(prev => [newTicket, ...prev]);

    // Push notification
    const newNotif: EMSNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Grievance Ticket Raised',
      description: `New ${ticketData.severity} severity grievance registered under ${ticketData.category}.`,
      time: 'Just now',
      type: 'grievance',
      read: false,
      targetModule: 'relations',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const resolveGrievance = (id: string, resolutionNote: string) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: 'Resolved', resolutionNote } : g));
  };

  // Exits
  const updateExitStatus = (id: string, status: 'Initiated' | 'In Review' | 'Cleared') => {
    setExits(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Global Search Engine
  const searchResults = useMemo<SearchResultItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // Search Employees
    employees.forEach(emp => {
      if (
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.skills.some(s => s.toLowerCase().includes(q)) ||
        (emp.location && emp.location.toLowerCase().includes(q))
      ) {
        results.push({
          id: emp.id,
          title: emp.name,
          subtitle: `${emp.role} • ${emp.department}`,
          category: 'Employee',
          targetTab: 'onboarding',
          badge: emp.status,
        });
      }
    });

    // Search Leaves
    leaves.forEach(l => {
      if (
        l.employeeName.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q) ||
        l.department.toLowerCase().includes(q)
      ) {
        results.push({
          id: l.id,
          title: `${l.employeeName} - ${l.type}`,
          subtitle: `${l.days} days • ${l.reason}`,
          category: 'Leave',
          targetTab: 'attendance',
          badge: l.status,
        });
      }
    });

    // Search Grievances
    grievances.forEach(g => {
      if (
        g.ticketNumber.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: g.id,
          title: `${g.ticketNumber}: ${g.subject}`,
          subtitle: `${g.category} • ${g.severity} Priority`,
          category: 'Grievance',
          targetTab: 'relations',
          badge: g.status,
        });
      }
    });

    // Search Goals
    goals.forEach(goal => {
      if (
        goal.title.toLowerCase().includes(q) ||
        goal.targetMetric.toLowerCase().includes(q) ||
        goal.quarter.toLowerCase().includes(q)
      ) {
        results.push({
          id: goal.id,
          title: goal.title,
          subtitle: `${goal.quarter} • Metric: ${goal.targetMetric}`,
          category: 'Goal',
          targetTab: 'performance',
          badge: `${goal.currentProgress}%`,
        });
      }
    });

    return results.slice(0, 8); // Top 8 matches
  }, [searchQuery, employees, leaves, grievances, goals]);

  return (
    <EMSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        leaves,
        addLeave,
        updateLeaveStatus,
        goals,
        addGoal,
        updateGoalProgress,
        grievances,
        addGrievance,
        resolveGrievance,
        exits,
        updateExitStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearchModalOpen,
        setIsSearchModalOpen,
      }}
    >
      {children}
    </EMSContext.Provider>
  );
};

export const useEMS = () => {
  const context = useContext(EMSContext);
  if (!context) {
    throw new Error('useEMS must be used within an EMSProvider');
  }
  return context;
};
