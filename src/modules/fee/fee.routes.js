import { Router } from 'express';
import * as ctrl from './fee.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize, authorizeScope } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('fee:read'), ctrl.list);
router.post('/', authorize('fee:create'), ctrl.create);
router.get('/:id', authorize('fee:read'), ctrl.getById);
router.put('/:id', authorize('fee:update'), ctrl.update);
router.delete('/:id', authorize('fee:delete'), ctrl.remove);




// Module-specific routes
// Fee structures
router.post('/structures/:id/components', authorize('fee:create'), ctrl.addFeeStructureComponent);
router.post('/structures/:id/installments', authorize('fee:create'), ctrl.addFeeInstallment);

// Concessions
router.post('/concessions/:id/records', authorize('fee:create'), ctrl.addFeeConcessionRecord);

// Student fees
router.get('/student-fees/my', authorizeScope('STUDENT'), ctrl.getMyFees);
router.post('/allocate', authorize('fee:create'), ctrl.allocateStudentFee);
router.post('/payments', authorize('fee:create'), ctrl.processPayment);
router.get('/payments', authorize('fee:read'), ctrl.listPayments);
router.post('/refunds', authorize('fee:create'), ctrl.processRefund);
router.get('/refunds', authorize('fee:read'), ctrl.listRefunds);
router.get('/missing', authorize('fee:read'), ctrl.detectMissingFees);
router.get('/mismatches', authorize('fee:read'), ctrl.detectMismatches);
router.post('/import', authorize('fee:create'), ctrl.importCustomFees);

// Financial transactions
router.get('/ledger-types', authorize('finance:read'), ctrl.listLedgerTypes);
router.post('/ledger-types', authorize('finance:create'), ctrl.createLedgerType);
router.get('/ledgers', authorize('finance:read'), ctrl.listLedgers);
router.post('/ledgers', authorize('finance:create'), ctrl.createLedger);
router.get('/payment-methods', authorize('finance:read'), ctrl.listPaymentMethods);
router.post('/payment-methods', authorize('finance:create'), ctrl.createPaymentMethod);
router.get('/transactions', authorize('finance:read'), ctrl.listTransactions);
router.post('/transactions', authorize('finance:create'), ctrl.createTransaction);
router.get('/transactions/:id', authorize('finance:read'), ctrl.getTransaction);
router.post('/transactions/import', authorize('finance:create'), ctrl.importTransactions);

// Day closure
router.post('/day-closure', authorize('finance:create'), ctrl.closeDailyCollection);
router.get('/day-closure', authorize('finance:read'), ctrl.getDayClosure);

// Reports
router.get('/reports/day-book', authorize('finance:read'), ctrl.getDayBook);
router.get('/reports/fee-summary', authorize('finance:read'), ctrl.getFeeSummary);
router.get('/reports/head-wise', authorize('finance:read'), ctrl.getHeadWiseSummary);
router.get('/reports/concession-summary', authorize('finance:read'), ctrl.getConcessionSummary);
router.get('/reports/export', authorize('finance:export'), ctrl.exportFeeReport);




export default router;
