import { Form } from "react-bootstrap";

const StockSelector = ({ stocks, stockId, setStockId }) => (
  <Form.Select value={stockId} onChange={(e) => setStockId(e.target.value)}>
    <option value="">Select an ingredient</option>
    {stocks.map((stock) => (
      <option key={stock._id} value={stock._id}>
        {stock.libelle}
      </option>
    ))}
  </Form.Select>
);

export default StockSelector;
