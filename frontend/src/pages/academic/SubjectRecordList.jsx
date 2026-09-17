import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import GenericList from '../../components/GenericList';
import SubjectInchargeModal from './SubjectInchargeModal';

export default function SubjectRecordList({ config }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleAssignClick = (row) => {
    setSelectedRecord(row);
    setModalOpen(true);
  };

  const rowActions = [
    {
      label: 'Assign Incharge',
      icon: <UserPlus className="w-4 h-4" />,
      onClick: handleAssignClick
    }
  ];

  return (
    <>
      <GenericList
        title={config.plural}
        endpoint={config.endpoint}
        columns={config.listColumns}
        createPath={`${config.basePath}/new`}
        editPath={`${config.basePath}/:id/edit`}
        rowActions={rowActions}
      />
      
      {modalOpen && (
        <SubjectInchargeModal
          subjectRecord={selectedRecord}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
