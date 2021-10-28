import Card from "../../../common/Card";
import Wrapper from "../common/Wrapper";

function Orders() {
  return (
    <Wrapper pageTitle="Orders">
      <section className="row g-3">
        <div className="col-sm-4">
          <Card title="Incoming"></Card>
        </div>
        <div className="col-sm-4">
          <Card title="In Warehouse"></Card>
        </div>
        <div className="col-sm-4">
          <Card title="Outgoing"></Card>
        </div>
      </section>
    </Wrapper>
  );
}

export default Orders;
