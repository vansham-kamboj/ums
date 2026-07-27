/**
 * System-wide constants and enums
 */

export const USER_SCOPES = ['ADMIN', 'STUDENT', 'GUARDIAN', 'EMPLOYEE'];
export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'BANNED'];

export const PAYMENT_STATUSES = ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'REFUNDED', 'CANCELLED'];
export const APPROVAL_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const GENDERS = ['MALE', 'FEMALE', 'OTHER'];

export const COMMUNICATION_CHANNELS = ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'];

export const PAYROLL_STATUSES = ['DRAFT', 'PROCESSED', 'APPROVED', 'PAID', 'CANCELLED'];

export const QUESTION_TYPES = ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'LONG_ANSWER', 'FILL_BLANK'];

export const GALLERY_TYPES = ['PHOTO', 'VIDEO'];

export const FORM_FIELD_TYPES = [
  'TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'PHONE',
  'DATE', 'SELECT', 'MULTI_SELECT', 'CHECKBOX', 'RADIO', 'FILE', 'URL',
];

export const PAYMENT_GATEWAYS = [
  'razorpay', 'stripe', 'paystack', 'billdesk',
  'ccavenue', 'billplz', 'hubtel', 'payzone', 'amwalpay', 'bank_transfer',
];

export const MODULES = [
  'academic', 'student', 'guardian', 'employee', 'fee', 'exam',
  'attendance', 'timetable', 'transport', 'library', 'hostel',
  'inventory', 'mess', 'reception', 'communication', 'calendar',
  'resource', 'onlineExam', 'recruitment', 'discipline', 'activity',
  'blog', 'news', 'gallery', 'customForm', 'approval', 'task',
  'helpdesk', 'socialWall', 'chat', 'notification', 'serviceRequest',
  'certificate', 'report', 'payment', 'website', 'config', 'user',
  'team', 'utility', 'importExport', 'integration',
];

// 62+ configurable option types from the features document
export const OPTION_TYPES = [
  'todo_list', 'member_caste', 'member_category', 'religion', 'document_type',
  'qualification_level', 'registration_stage', 'student_attendance_type',
  'student_enrollment_type', 'student_enrollment_status', 'student_dialogue_category',
  'student_document_type', 'student_transfer_reason', 'student_leave_category',
  'student_group', 'employee_dialogue_category', 'employee_document_type',
  'employment_status', 'employment_type', 'employee_group', 'bank_name',
  'card_provider', 'vehicle_type', 'vehicle_document_type', 'vehicle_trip_purpose',
  'vehicle_case_type', 'vehicle_expense_type', 'book_author', 'book_language',
  'book_publisher', 'book_topic', 'book_condition', 'book_category',
  'calling_purpose', 'visiting_purpose', 'gate_pass_purpose', 'enquiry_stage',
  'enquiry_type', 'enquiry_source', 'complaint_type', 'subject_type',
  'event_type', 'assignment_type', 'announcement_type', 'fee_concession_type',
  'trip_type', 'incident_category', 'blog_category', 'news_category',
  'transaction_category', 'approval_request_priority', 'approval_request_group',
  'approval_request_nature', 'unit', 'stock_item_condition', 'task_category',
  'task_priority', 'task_list', 'faq_category', 'ticket_category',
  'ticket_priority', 'ticket_list',
];
