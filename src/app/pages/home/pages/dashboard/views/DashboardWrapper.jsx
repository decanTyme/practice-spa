import "../styles/dashboard-wrapper.css";
import useThemeProvider from "../../../../../../services/providers/theme";
import { Bar, Line } from "react-chartjs-2";
import {
  myBarChart,
  myLineBarComboChart,
  myLineChart,
} from "../../../../../../sample-charts";
import dollarSignImg from "../../../../../../assets/sign_dollar.png";
import laptopSignImg from "../../../../../../assets/sign_laptop.png";
import cashSignImg from "../../../../../../assets/sign_cash.png";
import pieSignImg from "../../../../../../assets/sign_pie.jpg";
import peopleSignImg from "../../../../../../assets/sign_people.png";
import SummaryCard from "../components/SummaryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { isMobile } from "react-device-detect";
import PageWrapper from "../../../common/PageWrapper";

const generateRandomData = (n) =>
  Math.floor(Math.random() * (n || 1000000)).commaSplice();

function Dashboard() {
  const { theme } = useThemeProvider();

  return (
    <PageWrapper pageTitle={`Dashboard (${theme})`}>
      {/* --------------------------- Card Summary Row --------------------------- */}
      <div
        className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-5 mb-3 g-3"
        data-masonry='{"percentPosition": true }'
      >
        <div className="col">
          <SummaryCard
            data={generateRandomData()}
            type="Total Revenue"
            isCurrency={true}
            icon={{ src: dollarSignImg, width: "75" }}
            lastUpdated={5}
          />
        </div>

        <div className="col">
          <SummaryCard
            data={generateRandomData()}
            type="Online Revenue"
            isCurrency={true}
            icon={{ src: laptopSignImg, width: "60" }}
            lastUpdated={2}
          />
        </div>

        <div className="col">
          <SummaryCard
            data={generateRandomData()}
            type="Expenses"
            isCurrency={true}
            icon={{ src: cashSignImg, width: "60" }}
            lastUpdated={8}
          />
        </div>

        <div className="col">
          <SummaryCard
            data={generateRandomData()}
            type="Expenditure"
            isCurrency={true}
            icon={{ src: pieSignImg, width: "60" }}
            lastUpdated={3}
          />
        </div>

        <div className="col">
          <SummaryCard
            data={generateRandomData(1000)}
            type="Total Customers"
            isCurrency={false}
            icon={{ src: peopleSignImg, width: "65" }}
            lastUpdated={5}
          />
        </div>
      </div>

      {/* --------------------------- Main Content Row --------------------------- */}
      <div className="row g-3 mb-3 main-content">
        {/* ------------------------- Sales Line Chart ------------------------- */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="card-title">Monthly Sales</div>
              <Line data={myLineChart} />
            </div>
          </div>
        </div>

        {/* --------------------------- Average Data --------------------------- */}
        <div className="col-lg-2">
          <div className="row row-cols-1 g-3 row-cols-md-2 row-cols-lg-1">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p className="card-title mb-0">Sales</p>
                  <h5 className="card-text">{generateRandomData(10000)}+</h5>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p className="card-title mb-0">Reviews</p>
                  <h5 className="card-text">{generateRandomData(10000)}+</h5>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p className="card-title mb-0">Visitors/Customers</p>
                  <h5 className="card-text">{generateRandomData(10000)}+</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------- Social Media Statistics ---------------------- */}
        <div className="col-lg-2">
          <div className="row g-0">
            <div className="card p-0 mb-2">
              <div
                className="card-img-top p-3 fs-4 text-center"
                style={{ backgroundColor: "#4267B2" }}
                alt=""
              >
                <FontAwesomeIcon
                  icon={faFacebookF}
                  style={{ color: "white" }}
                />
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <p className="mb-0 h5">{generateRandomData(10000)}</p>
                    <p className="mb-0 text-muted">Friends</p>
                  </div>
                  <div className="col-6">
                    <h5 className="mb-0">{generateRandomData(10000)}</h5>
                    <p className="mb-0 text-muted">Likes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-0 mb-2">
              <div
                className="card-img-top p-3 fs-4 text-center"
                style={{ backgroundColor: "#cd486b" }}
                alt=""
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  style={{ color: "white" }}
                />
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <p className="mb-0 h5">{generateRandomData(10000)}</p>
                    <p className="mb-0 text-muted">Followers</p>
                  </div>
                  <div className="col-6">
                    <h5 className="mb-0">{generateRandomData(10000)}</h5>
                    <p className="mb-0 text-muted">Hearts</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-0">
              <div
                className="card-img-top p-3 fs-4 text-center"
                style={{ backgroundColor: "#00acee" }}
                alt=""
              >
                <FontAwesomeIcon icon={faTwitter} style={{ color: "white" }} />
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <p className="mb-0 h5">{generateRandomData(10000)}</p>
                    <p className="mb-0 text-muted">Followers</p>
                  </div>
                  <div className="col-6">
                    <h5 className="mb-0">{generateRandomData(10000)}</h5>
                    <p className="mb-0 text-muted">Retweets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------- Sales Bar Chart ------------------------- */}
      </div>
      <div className="row g-3 main-content">
        <div className="col-sm-4">
          <div className="card mb-2">
            <div className="card-body">
              <div className="card-title">Sample Overview Statistics</div>
              <div className="card-text">
                <Bar data={myBarChart.data} options={myBarChart.options} />
              </div>
            </div>
            <div className="card-footer">
              <small className="text-muted">Last updated 3 mins ago</small>
            </div>
          </div>
        </div>
        {/* ----------------------- Combo Bar/Line Chart ---------------------- */}
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">
              <div className="card-title">Sample Overview Statistics</div>
              <Line data={myLineBarComboChart} height={isMobile ? null : 70} />
            </div>
            <div className="card-footer">
              <small className="text-muted">Last updated 8 mins ago</small>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
