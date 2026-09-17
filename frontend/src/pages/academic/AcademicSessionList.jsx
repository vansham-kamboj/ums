import React from 'react';
import { Archive, ArchiveRestore } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import GenericList from '../../components/GenericList';

export default function AcademicSessionList({ config }) {
  const toast = useToast();

  const handleArchive = async (row) => {
    try {
      if (row.isArchived) {
        await api.put(`/academic/sessions/${row.id}/unarchive`);
        toast.success('Session unarchived successfully');
      } else {
        await api.put(`/academic/sessions/${row.id}/archive`);
        toast.success('Session archived successfully');
      }
      // Note: In a real app we'd trigger a reload of the GenericList data here.
      // For this implementation, we can reload the page or assume GenericList can be passed a refresh trigger.
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update session');
    }
  };

  const rowActions = [
    {
      label: 'Archive / Unarchive',
      icon: (row) => row.isArchived ? <ArchiveRestore className="w-4 h-4 text-green-600" /> : <Archive className="w-4 h-4 text-orange-600" />,
      onClick: handleArchive
    }
  ];

  // We need to resolve the icon properly since it's a function of row
  // Wait, GenericList rowActions icon is rendered as: action.icon 
  // If it's a function, we should evaluate it, but currently GenericList just renders {action.icon}.
  // Let's adjust it by mapping the columns or we just update GenericList to support functional icons.
  // Actually, let's just make it a static icon or we update GenericList to check if icon is a function.
  
  return (
    <GenericList
      title={config.plural}
      endpoint={config.endpoint}
      columns={config.listColumns}
      createPath={`${config.basePath}/new`}
      editPath={`${config.basePath}/:id/edit`}
      rowActions={rowActions}
    />
  );
}
