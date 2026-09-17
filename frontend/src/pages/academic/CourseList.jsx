import React, { useState } from 'react';
import { Download } from 'lucide-react';
import GenericList from '../../components/GenericList';
import CourseImportModal from './CourseImportModal';

export default function CourseList({ config }) {
  const [importOpen, setImportOpen] = useState(false);

  const importButton = (
    <button
      onClick={() => setImportOpen(true)}
      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-text-secondary border border-border-color px-4 py-2.5 rounded-md font-medium text-sm transition-colors"
    >
      <Download className="w-4 h-4" />
      Import Courses
    </button>
  );

  return (
    <>
      <GenericList
        title={config.plural}
        endpoint={config.endpoint}
        columns={config.listColumns}
        createPath={`${config.basePath}/new`}
        editPath={`${config.basePath}/:id/edit`}
        actions={importButton}
      />
      
      {importOpen && (
        <CourseImportModal onClose={() => setImportOpen(false)} />
      )}
    </>
  );
}
