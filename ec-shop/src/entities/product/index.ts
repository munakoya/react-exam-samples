// entities/product の窓口（Public API）
export {
  findProduct,
  productCategories,
  productCategoryLabels,
  productCategoryOptions,
  products,
  type Product,
  type ProductCategory,
} from "./model/product";
export { ProductCard } from "./ui/ProductCard";
