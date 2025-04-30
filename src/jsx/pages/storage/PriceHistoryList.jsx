import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaSearch,
  FaTimesCircle,
  FaDollarSign,
  FaStore,
  FaCarrot,
  FaBoxes,
  FaCalendarAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "animate.css";
import usePriceHistoryStore from "../../store/usePriceHistoryStore";

const PriceHistoryList = () => {
  return (
    <Card>
      <Card.Header>
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Price History</h5>
        </div>
      </Card.Header>
      <Card.Body></Card.Body>
    </Card>
  );
};

export default PriceHistoryList;
