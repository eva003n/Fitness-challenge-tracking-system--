import Container from "../components/common/Container";
import ProgressCard from "../components/Reports/ProgressCard";
import BarChartComponent from "../components/Reports/BarChart";
import { useEffect, useState, useRef } from "react";
import { getActivityProgress } from "../services";
import { useAuth } from "../context/authProvider";
import LineChartComponent from "../components/Reports/LineChart";
import { getWholeNumber } from "../utils/index";
import Select from "../components/common/Select";
import Label from "../components/common/label";
import { FilterX, Loader, Download } from "lucide-react";
import Button from "../components/common/Button";
import UserSummaryReport from "../components/Reports/SummartReport";
import Scrim from "../components/common/Scrim";
import {jsPDF} from "jspdf";  
import html2canvas from "html2canvas";

const METRICS = [
  { title: "Heart rate" },
  { title: "Calories" },
  { title: "Distance" },
  { title: "Steps taken" },
];

const Reports = () => {
  const [timeLine, setTimeLine] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    heartRate: [],
    calories: [],
    distance: [],
    steps: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const reportRef = useRef(null);
  useEffect(() => {
    const getProgress = async () => {
      try {
        setIsLoading(true);
        const response = await getActivityProgress(
          user._id,
          timeLine.year,
          timeLine.month
        );

        setData({
          heartRate: response.data[0].heartRate,
          calories: response.data[0].calories,
          distance: response.data[0].distance,
          steps: response.data[0].steps,
        });
        setIsLoading(false);
      } catch (e) {
        console.log(e.message);
        setIsLoading(false);
      }
    };
    getProgress();
  }, [timeLine]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimeLine({ ...timeLine, [name]: value });
  };
  const handleShow = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  const generatePdf = () => {
    const contentArea = reportRef.current
    const doc = new jsPDF()
  }
  return (
    <Container>
      <div className="mx-auto max-w-[65rem]">
        {isOpen && (
          <Scrim onShow={handleShow}>
      {/* printable content */}

            <UserSummaryReport ref={reportRef} metrics={data && data} />
          </Scrim>
        )}
        <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <Button
              name={isLoading ? "Generating..." : "Download report"}
              icon={!isLoading ? Download : Loader}
              className="bg-violet-600 hover:bg-violet-700 text-gray-100"
              loader={isLoading}
              isLoading={isLoading}
            />
           {
            !isLoading && (
              <Button 
              name={"Preview"}
              className="bg-violet-600 hover:bg-violet-700 text-gray-100"
              onClick={handleShow} />
            )
           }
          </div>
          <div className="flex w-full items-center justify-between md:w-auto">
            <div className="flex items-center gap-2">
              <Label
                name={"Year"}
                icon={FilterX}
                className="hidden items-center gap-2 md:flex"
              />
              <Select
                name={"year"}
                value={timeLine.year}
                onChange={handleChange}
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label
                name={"Month"}
                icon={FilterX}
                className="hidden items-center gap-2 md:flex"
              />
              <Select
                name={"month"}
                value={timeLine.month}
                onChange={handleChange}
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}> May</option>
                <option value={6}> June</option>
                <option value={7}> July</option>
                <option value={8}>August</option>
                <option value={9}> September</option>
                <option value={10}> October</option>
                <option value={11}> November</option>
                <option value={12}> December</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="mx-auto grid gap-4 sm:grid-cols-2">
          <ProgressCard title={METRICS[0].title} isLoading={isLoading}>
            <LineChartComponent
              data={data && data.heartRate}
              color={"#ff0000"}
            />
          </ProgressCard>
          <ProgressCard title={METRICS[3].title} isLoading={isLoading}>
            <LineChartComponent data={data && data.steps} color={"#00FF00"} />
          </ProgressCard>
          <ProgressCard title={METRICS[2].title} isLoading={isLoading}>
            <BarChartComponent data={data && data.distance} />
          </ProgressCard>
          <ProgressCard title={METRICS[1].title} isLoading={isLoading}>
            <BarChartComponent data={data && data.calories} />
          </ProgressCard>
        </div>
      </div>
    </Container>
  );
};

export default Reports;
