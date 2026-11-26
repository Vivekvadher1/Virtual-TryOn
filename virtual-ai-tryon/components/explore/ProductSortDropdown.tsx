interface ProductSortDropdownProps {
  sortOption: string;
  onSortChange: (value: string) => void;
}

export default function ProductSortDropdown({
  sortOption,
  onSortChange,
}: ProductSortDropdownProps) {
  return (
    <div className="product-sort">
      <label htmlFor="product-sort-select">Sort By:</label>

      <select
        id="product-sort-select"
        value={sortOption}
        onChange={(event) => onSortChange(event.target.value)}
      >
        <option value="default">Default</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="name-a-z">Name: A to Z</option>
      </select>
    </div>
  );
}
