import { Form, Button } from "react-bootstrap";

const BulkUpdateFormStep = ({ bulkUpdateData, supplier, handleBulkUpdateChange, onNext, onCancel }) => (
  <section>
    <div className="row">
      {bulkUpdateData.map((ingredient, index) => (
        <div key={ingredient.ingredientId} className="col-lg-6 mb-2">
          <div className="form-group mb-3">
            <label className="form-label">{supplier.ingredients[index].name}</label>
            <div className="mb-2">
              <label className="form-label">Price per Unit <span className="required">*</span></label>
              <Form.Control
                type="number"
                step="0.01"
                value={ingredient.pricePerUnit}
                onChange={(e) => handleBulkUpdateChange(index, "pricePerUnit", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Lead Time (Days) <span className="required">*</span></label>
              <Form.Control
                type="number"
                value={ingredient.leadTimeDays}
                onChange={(e) => handleBulkUpdateChange(index, "leadTimeDays", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="text-end toolbar toolbar-bottom p-2">
      <Button className="btn btn-secondary sw-btn-prev me-1" onClick={onCancel}>
      &lt;
      </Button>
      <Button className="btn btn-primary sw-btn-next ms-1" onClick={onNext}>
      &gt;
      </Button>
    </div>
  </section>
);

export default BulkUpdateFormStep;