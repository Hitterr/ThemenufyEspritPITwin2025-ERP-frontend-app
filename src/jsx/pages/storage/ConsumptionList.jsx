import React, { useEffect, useState, useMemo, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
  Row,
  Col,
  Badge,
  ButtonGroup,
} from "react-bootstrap";
import {
  FaSearch,
  FaTimesCircle,
  FaUtensils,
  FaCarrot,
  FaTimes,
  FaFilter,
  FaStore,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import Swal from "sweetalert2";
import "animate.css";
import useConsumptionHistoryStore from "../../store/useConsumptionHistoryStore";
import { useRestaurantQuery, useStocksQuery } from "./utils/queries";
import { useConsumptionsQuery } from "./utils/queries";

// Extracted chart options for better organization
const getChartOptions = (dates) => ({
  chart: {
    type: "area",
    height: 350,
    toolbar: {
      show: true,
      tools: { download: true, selection: true, pan: true, reset: true },
    },
  },
  colors: ["#3a86ff"],
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100],
    },
  },
  xaxis: {
    categories: dates,
    labels: { formatter: (value) => value },
  },
  yaxis: {
    title: { text: "Quantity Consumed" },
    labels: { formatter: (val) => val.toFixed(0) },
  },
  tooltip: { y: { formatter: (val) => `${val} units` } },
});

const ConsumptionList = () => {
  return (
    <Card>
      <Card.Header>
        <div className="d-flex align-items-center">
          <FaChartLine className="me-2 text-muted" />
          <h5 className="mb-0">Consumption History</h5>
        </div>
      </Card.Header>
      <Card.Body></Card.Body>
    </Card>
  );
};

export default ConsumptionList;
