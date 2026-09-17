import { Route, Routes } from 'react-router-dom';
import SessionSetup from './SessionSetup';
import DepartmentSetup from './DepartmentSetup';
import ProgramTypeSetup from './ProgramTypeSetup';
import ProgramSetup from './ProgramSetup';
import CourseSetup from './CourseSetup';
import DivisionSetup from './DivisionSetup';
import BatchSetup from './BatchSetup';
import SubjectAssignment from './SubjectAssignment';
import EnrollmentSeats from './EnrollmentSeats';
import ClassTimingGrid from './ClassTimingGrid';

export default function AcademicRoutes() {
  return (
    <Routes>
      {/* 1. Academic Session */}
      <Route index element={<SessionSetup />} />
      <Route path="sessions" element={<SessionSetup />} />

      {/* 2. Department */}
      <Route path="departments" element={<DepartmentSetup />} />

      {/* Program Type (UG/PG/Diploma) */}
      <Route path="program-types" element={<ProgramTypeSetup />} />

      {/* 3. Program */}
      <Route path="programs" element={<ProgramSetup />} />

      {/* 4. Course */}
      <Route path="courses" element={<CourseSetup />} />

      {/* 5. Division / Branch / Stream */}
      <Route path="divisions" element={<DivisionSetup />} />

      {/* 6. Batch */}
      <Route path="batches" element={<BatchSetup />} />

      {/* 7 & 8. Subjects & Subject Types */}
      <Route path="subjects" element={<SubjectAssignment />} />
      <Route path="subject-types" element={<SubjectAssignment />} />
      <Route path="subject-records" element={<SubjectAssignment />} />

      {/* 10. Enrollment Seats */}
      <Route path="enrollment-seats" element={<EnrollmentSeats />} />

      {/* 9. Class Timings */}
      <Route path="class-timings" element={<ClassTimingGrid />} />
    </Routes>
  );
}
