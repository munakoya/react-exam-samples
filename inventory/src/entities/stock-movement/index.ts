// entities/stock-movement の窓口（Public API）
export {
  movementTypeLabels,
  movementTypeOptions,
  movementTypes,
  type MovementType,
  type StockMovement,
  type StockMovementInput,
} from "./model/stockMovement";
export { useStockMovementStore } from "./model/stockMovementStore";
export { StockMovementTable } from "./ui/StockMovementTable";
