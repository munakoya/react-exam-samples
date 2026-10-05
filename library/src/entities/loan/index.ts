// entities/loan の窓口（Public API）
export {
  availabilities,
  availabilityLabels,
  availabilityOptions,
  getAvailability,
  getCurrentLoanMap,
  getLoanStatus,
  isActiveLoan,
  loanSchema,
  loanStatusLabels,
  loanStatuses,
  type Availability,
  type Loan,
  type LoanInput,
  type LoanStatus,
} from "./model/loan";
export { useCurrentLoan, useLoanStore } from "./model/loanStore";
export { AvailabilityChip } from "./ui/AvailabilityChip";
export { DUE_SOON_DAYS, DueDateLabel } from "./ui/DueDateLabel";
export { LoanHistoryTable } from "./ui/LoanHistoryTable";
