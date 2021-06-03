import React, { Component, useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar.js";
import BarChart from "../BarChart/BarChart";
import {
  Chart,
  Tooltip,
  CategoryScale,
  LinearScale,
  Title,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";
import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardIcon from "../Card/CardIcon.js";
import CardBody from "../Card/CardBody";
import CardFooter from "../Card/CardFooter";
import GridItem from "../Grid/GridItem.js";
import GridContainer from "../Grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import Table from "../Table/Table";
import Icon from "@material-ui/core/Icon";
import Danger from "../Typography/Danger.js";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import Update from "@material-ui/icons/Update";
import Store from "@material-ui/icons/Store";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Accessibility from "@material-ui/icons/Accessibility";
// import { Icon, InlineIcon } from '@iconify/react';
import contentCopy from "@iconify-icons/mdi/content-copy";
import styles from "../../assets/jss/material-dashboard/views/dashboardStyle.js";

import Map from "../Map/map";

import Axios from "axios"; //axios library to make requests to api
import "./Home.css";
import ReactPaginate from "react-paginate";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

Chart.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  Title,
  LineController,
  LineElement,
  PointElement
);

var i = 0;

function Home(props) {
  //make an axios request to get intents data from database
  const [intentsList, setintentsList] = useState([]);
  useEffect(() => {
    Axios.get("http://localhost:3001/intents").then((response) => {
      setintentsList(response.data);
    });
  }, []);

  const [customerList, setCustomerList] = useState([]); //store all that information of the database in a list
  //make an axios request to get information from database
  useEffect(() => {
    Axios.get("http://localhost:3001/customers").then((response) => {
      setCustomerList(response.data);
    });
  }, []);

  const updateCustomerContacted = (ID) => {
    Axios.put("http://localhost:3001/update", {
      contacted: newContacted,
      ID: ID,
    }).then((response) => {
      Axios.get("http:localhost:3001/customers").then((response) => {
        setCustomerList(response.data);
      });
    });
  };

  //function to format the datetime to correct format
  const formatDatetime = (datetime) => {
    const dateStr = new Date(datetime).toLocaleDateString("en-CA");
    const timeStr = new Date(datetime).toLocaleTimeString();
    return `${dateStr} ${timeStr}`;
  };

  //function to format serial number manually

  //delete function
  const deleteCustomer = (ID) => {
    Axios.delete(`http://localhost:3001/stats/delete/${ID}`).then(
      (response) => {
        setCustomerList(
          customerList.filter((val) => {
            return val.ID != ID;
          })
        );
      }
    );
  };

  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const customersPerPage = 5; //change this number according to desired number of rows in a page
  const pagesVisited = pageNumber * customersPerPage;
  const displayCustomers = customerList
    .slice(pagesVisited, pagesVisited + customersPerPage)
    .map((val, key) => {
      const dateStr = new Date(val.latest_time_of_visit).toLocaleDateString(
        "en-CA"
      );
      const timeStr = new Date(val.latest_time_of_visit).toLocaleTimeString();
      const dateTime = `${dateStr} ${timeStr}`;
      const my_serial = key + pageNumber * customersPerPage;
      return (
        <tr>
          {/*}
          <td>{val.ID}</td>
      */}
          <td>{my_serial + 1}</td>
          <td>{val.name}</td>
          <td>{val.email}</td>
          <td>{val.counts_of_visit}</td>
          <td>{dateTime}</td>
          <td>{val.contacted}</td>
          <td>
            <select
              onChange={(event) => {
                setNewContacted(event.target.value);
              }}
            >
              <option value="" selected disabled hidden>
                Select Yes/No
              </option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <button
              className="btn btn-primary"
              onClick={() => {
                updateCustomerContacted(val.ID);
              }}
            >
              Update
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteCustomer(val.ID);
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  //to account for the fact that total number of customers cannot be divided equally among the pages
  const pageCount = Math.ceil(customerList.length / customersPerPage);
  //page change
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  //update contacted column
  const [newContacted, setNewContacted] = useState(0);

  {
    /*}
      const [currentTime, setCurrentTime] = useState(1);
    
      useEffect(() => {
        fetch("/time")
          .then((res) => res.json())
          .then((data) => {
            setCurrentTime(data.time);
          });
      }, []);
    */
  }

  //export to csv function

  const DataSet = [
    {
      columns: [
        {
          title: "S/N",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        }, // width in pixels
        {
          title: "Customer Information",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 250 },
        }, // width in pixels
        {
          title: "Customer Email",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 250 },
        }, // width in pixels
        {
          title: "Counts of Visit",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 175 },
        }, // width in pixels
        {
          title: "Latest Time of Visit",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 250 },
        }, // width in pixels
        {
          title: "Contacted?",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 250 },
        }, // width in pixels
      ],
      data: customerList.map((val, key) => [
        { value: key + 1, style: { font: { sz: "14" } } },
        { value: val.name, style: { font: { sz: "14" } } },
        { value: val.email, style: { font: { sz: "14" } } },
        { value: val.counts_of_visit, style: { font: { sz: "14" } } },
        {
          value: formatDatetime(val.latest_time_of_visit),
          style: { font: { sz: "14" } },
        },
        { value: val.contacted, style: { font: { sz: "14" } } },
      ]),
    },
  ];

  const useStyles = makeStyles(styles);
  const classes = useStyles;

  return (
    <div>
      <Navbar />
      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          {" "}
          {/*width for different screen sizes*/}
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="danger">
                <h4 className={classes.cardTitleWhite}>Product Statistics</h4>
                {/* <Icon>content_copy</Icon> */}
              </CardIcon>
              <p className={classes.cardCategory}>Used Space</p>
              <h3 className={classes.cardTitle}>
                49/50 <small>GB</small>
              </h3>
            </CardHeader>
            <CardBody>
              <BarChart />
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={(e) => e.preventDefault()}></a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="dark" stats icon>
              <CardIcon color="dark">
                {/* <Store /> */}
                <h4 className={classes.cardTitleWhite}>Locations</h4>
              </CardIcon>

              <p className={classes.cardCategory}>Revenue</p>
              <h3 className={classes.cardTitle}>$34,245</h3>
            </CardHeader>
            <CardBody>
              <Map />
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={6} md={6}>
                    <Card>
                        <CardHeader color="danger" stats icon>
                        <CardIcon color="danger">
                            <Icon>info_outline</Icon>
                        </CardIcon>
                        <p className={classes.cardCategory}>Fixed Issues</p>
                        <h3 className={classes.cardTitle}>75</h3>
                        </CardHeader>
                        <CardFooter stats>
                        <div className={classes.stats}>
                            <LocalOffer />
                            
                        </div>
                        </CardFooter>
                    </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                    <Card>
                        <CardHeader color="info" stats icon>
                        <CardIcon color="info">
                            <Accessibility />
                        </CardIcon>
                        <p className={classes.cardCategory}>Followers</p>
                        <h3 className={classes.cardTitle}>+245</h3>
                        </CardHeader>
                        <CardFooter stats>
                        <div className={classes.stats}>
                            <Update />
                           
                        </div>
                        </CardFooter>
                    </Card>
                    </GridItem> */}
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Customer Information</h4>
              {/*}
              <p className={classes.cardCategoryWhite}>
                Visitors since 16th May, 2021
              </p>
                */}
            </CardHeader>
            <CardBody>
              <div className="dashboardcontainer">
                <div className="container"></div>
                <table className="customertable">
                  <thead>
                    <tr>
                      {/*}
                      <th>S/N</th>
              */}
                      <th>S/N</th>
                      <th>Customer Name</th>
                      <th>Customer Email</th>
                      <th>Counts of Visit</th>
                      <th>Latest Time of Visit</th>
                      <th>Contacted?</th>
                      <th>Edit Contacted</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{displayCustomers}</tbody>
                </table>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"paginationBttns"}
                  pageLinkClassName={"paginationNumber"}
                  previousLinkClassName={"previousBttn"}
                  nextLinkClassName={"nextBttn"}
                  disabledClassName={"paginationDisabled"}
                  activeClassName={"paginationActive"}
                />
                <ExcelFile
                  filename="Customer Information"
                  element={
                    <button
                      type="button"
                      className="btn btn-success float-right m-3"
                    >
                      Export to Excel
                    </button>
                  }
                >
                  <ExcelSheet
                    dataSet={DataSet}
                    name="Customer Information Report"
                  ></ExcelSheet>
                </ExcelFile>
              </div>
              {/*}
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Salary", "Country"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                  ["4", "Philip Chaney", "$38,735", "Korea, South"],
                ]}
              />
            */}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Home;
