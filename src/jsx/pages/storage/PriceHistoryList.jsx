import { Card, Table } from "react-bootstrap";
import "animate.css";
import { usePriceHistoryQuery } from "./utils/queries";
import PriceHistoryLineChart from "./components/PriceHistoryLineChart";
const PriceHistoryList = () => {
  const { data: priceHistory, isFetched, isLoading } = usePriceHistoryQuery();
  if (isLoading) return <div>Loading...</div>;
  return (
    <Card>
      <Card.Body>
        <PriceHistoryLineChart />
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Stock</th>
              <th>Price History</th>
              <th>Restaurant</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {isFetched &&
              priceHistory &&
              priceHistory.map((each) => (
                <tr key={each._id}>
                  <td>{new Date(each?.createdAt).toLocaleDateString()}</td>
                  <td>{each?.stockId?.libelle}</td>
                  <td>{each?.price}</td>
                  <td>{each?.restaurantId?.nameRes}</td>
                  <td>{each?.supplierId?.name}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
export default PriceHistoryList;
