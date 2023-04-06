/*
Miguel Sevilla
Star Wars Database App for ULAAP Exercise
*/

import './App.css';
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

// Main App component to be rendered to user
function App() {
  return (
    <div>
      {/* render our NavBar component and implement navigation to our different Grid components using Routes within BrowserRouter */}
      <BrowserRouter>
        <div>
          <NavBar />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/people" element={<PeopleGrid />} />
          <Route path="/planets" element={<PlanetsGrid />} />
          <Route path="/starships" element={<StarshipsGrid />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


/*
  Implemented a simple NavBar component which will be rendered at the top of each page component
  which allows user to easily navigate to different pages within the web application using
  LinkContainers from react-router-bootstrap to navigate to the routes designated in our BrowserRouter
*/
function NavBar() {
  return (
    <Navbar className="mynav" bg="dark" variant="dark" expand="lg">
      <Navbar.Toggle className="toggler" /> {/* creates a toggle dropdown menu for each Nav link if window size is small */}
      <Navbar.Brand>
        <LinkContainer to="/">
          <Nav.Link>Star Wars App</Nav.Link>
        </LinkContainer>
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/people">
            <Nav.Link>People</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/planets">
            <Nav.Link>Planets</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/starships">
            <Nav.Link>Starships</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}


/*  
  Home page component to welcome user to the app and designate them to view the different Grid components available
  Makes use of react-bootstrap layout properties such as Row and Col as well as Card components to prompt user of
  the three different grid tables they can view data of
*/
function HomePage() {
  return (
    <Container style={{ textAlign: "center" }}>
      <Row>
        <h1>Welcome to the Star Wars Database!</h1>
      </Row>
      <Row>
        <h4>Explore the various tables and view details of your favourite characters, planets, and starships within the Star Wars universe.</h4>
      </Row>
      <Row>
        {/* Each column in this row contains a different clickable Card with use of LinkContainers, detailing each of the three Grid components of Star Wars data */}
        <Col>
          <LinkContainer to="/people">
            <Card style={{ width: 10 }}>
              <Card.Img variant="top" src="https://media.timeout.com/images/105863223/750/422/image.jpg" />
              <Card.Body>
                <Card.Title>People</Card.Title>
                <Card.Text>Click anywhere here to explore the details of your favourite characters!</Card.Text>
              </Card.Body>
            </Card>
          </LinkContainer>
        </Col>
        <Col>
          <LinkContainer to="/planets">
            <Card style={{ width: 10 }}>
              <Card.Img variant="top" src="https://reviewsyouread.files.wordpress.com/2021/03/10-more-star-wars-planets-as-countries.png" />
              <Card.Body>
                <Card.Title>Planets</Card.Title>
                <Card.Text>Click anywhere here to explore the details of the many planets across the Star Wars universe!</Card.Text>
              </Card.Body>
            </Card>
          </LinkContainer>
        </Col>
        <Col>
          <LinkContainer to="/starships">
            <Card style={{ width: 10 }}>
              <Card.Img variant="top" src="https://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeholder_wired.png,fl_progressive,g_face,h_450,q_80,w_800/v1576594418/wired_each-and-every-starfighter-in-star-wars-explained.jpg" />
              <Card.Body>
                <Card.Title>Starships</Card.Title>
                <Card.Text>Click here to explore the details of the different starships used throughout the Star Wars saga!</Card.Text>
              </Card.Body>
            </Card>
          </LinkContainer>
        </Col>
      </Row>
    </Container>
  )
}



// React AG-grid component displaying details of Star Wars people/characters
function PeopleGrid() {
  // defining the column definitions for people objects and assign specific Number filtering for appropriate headers using Numberic values 
  const columnDefs = [
    { field: "name" },
    { headerName: "Height (cm)", field: "height", filter: 'agNumberColumnFilter' },
    { headerName: "Mass (kg)", field: "mass", filter: 'agNumberColumnFilter' },
    { headerName: "Eye Color", field: "eye_color" },
    { headerName: "Hair Color", field: "hair_color" },
    { headerName: "Skin Color", field: "skin_color" },
    { headerName: "Birth Year", field: "birth_year" },
    { field: "gender" }
  ]

  /*
    Fetch data from Swapi REST API using react state hook
    Load API data on component launch with useEffect()
    Created an async function "fetchPeopleData" to loop through each page of people data until the "next" attribute is NULL
    and store each page of people objects into the list of "peopleData"
  */
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    let url = 'https://swapi.dev/api/people/'
    let peopleData = []

    const fetchPeopleData = async () => {
      while (url) {
        const res = await fetch(url)
        const data = await res.json()
        peopleData = peopleData.concat(data.results)
        url = data.next; // data.next stores url of next page of people or NULL
      }
      // set row data field to our list of people 
      setRowData(peopleData)
    }

    // call our async function to fetch multiple pages of Star Wars people data
    fetchPeopleData();
  }, [])


  /*
    create AG-grid using built-in theme and assign static height*
    assign default column definitions:
          flex sizing to divide remaining space
          basic sortability (ascending/descending)
          filter using text searches by default for columns that weren't assigned the NumberColumnFilter 
          buttons for applying the filter, clearing the filter options, and resetting the full table
  */
  return (
    <div>
      <div className='ag-theme-alpine' style={{ height: 800 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          animateRows={true}
          defaultColDef={{ flex: 1, sortable: true, filter: true, filterParams: { buttons: ['apply', 'clear', 'reset'] } }}>
        </AgGridReact>
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>People Grid</h1>
      </div>
    </div>
  )
}


// React AG-grid component displaying details of Star Wars planets
function PlanetsGrid() {
  // defining the column definitions for planet objects and assign specific Number filtering for appropriate headers using Numberic values 
  const columnDefs = [
    { field: "name" },
    { field: "population", filter: 'agNumberColumnFilter' },
    { headerName: "Rotation Period (hrs)", field: "rotation_period", filter: 'agNumberColumnFilter' },
    { headerName: "Orbital Period (days)", field: "orbital_period", filter: 'agNumberColumnFilter' },
    { headerName: "Diameter (km)", field: "diameter", filter: 'agNumberColumnFilter' },
    { headerName: "Surface Water (%)", field: "surface_water", filter: 'agNumberColumnFilter' },
    { field: "climate" },
    { field: "terrain" },
    { field: "gravity" }
  ]


  /*
    Fetch data from Swapi REST API using react state hook
    Load API data on component launch with useEffect()
    Created an async function "fetchPlanetData" to loop through each page of planet data until the "next" attribute is NULL
    and store each page of planet objects into the list of "planetData"
  */
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    let url = 'https://swapi.dev/api/planets/'
    let planetData = []

    const fetchPlanetData = async () => {
      while (url) {
        const res = await fetch(url)
        const data = await res.json()
        planetData = planetData.concat(data.results)
        url = data.next
      }
      // set row data field to our list of planets
      setRowData(planetData)
    }

    // call our async function to fetch multiple pages of Star Wars planet data
    fetchPlanetData();
  }, [])

  /*
    create AG-grid using built-in theme and assign static height*
    assign default column definitions:
          flex sizing to divide remaining space
          basic sortability (ascending/descending)
          filter using text searches by default for columns that weren't assigned the NumberColumnFilter 
          buttons for applying the filter, clearing the filter options, and resetting the full table
  */
  return (
    <div>
      <div className='ag-theme-alpine' style={{ height: 800 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          animateRows={true}
          defaultColDef={{ flex: 1, sortable: true, filter: true, filterParams: { buttons: ['apply', 'clear', 'reset'] } }}>
        </AgGridReact>
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>Planets Grid</h1>
      </div>
    </div>
  )
}


// React AG-grid component displaying details of Star Wars planets
function StarshipsGrid() {
  // defining the column definitions for starship objects and assign specific Number filtering for appropriate headers using Numberic values 
  const columnDefs = [
    { field: "name" },
    { field: "model" },
    { field: "manufacturer" },
    { headerName: "Starship Class", field: "starship_class" },
    { headerName: "Length (m)", field: "length", filter: 'agNumberColumnFilter' },
    { headerName: "Number of Passengers", field: "passengers", filter: 'agNumberColumnFilter' },
    { headerName: "Number of Crew Personnel", field: "crew", filter: 'agNumberColumnFilter' },
    { headerName: "Consumables (years)", field: "consumables" },
    { headerName: "Max Speed in Atmosphere", field: "max_atmosphering_speed", filter: 'agNumberColumnFilter' },
    { headerName: "Max megalights travelled in 1 hr", field: "MGLT", filter: 'agNumberColumnFilter' },
    { headerName: "Cargo Capacity (kg)", field: "cargo_capacity", filter: 'agNumberColumnFilter' },
    { headerName: "Hyperdrive Rating", field: "hyperdrive_rating", filter: 'agNumberColumnFilter' },
    { headerName: "Cost (credits)", field: "cost_in_credits", filter: 'agNumberColumnFilter' }
  ]


  /*
    Fetch data from Swapi REST API using react state hook
    Load API data on component launch with useEffect()
    Created an async function "fetchStarshipData" to loop through each page of starship data until the "next" attribute is NULL
    and store each page of starship objects into the list of "planetData"
  */
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    let url = 'https://swapi.dev/api/starships/'
    let starshipData = []

    const fetchStarshipData = async () => {
      while (url) {
        const res = await fetch(url)
        const data = await res.json()
        starshipData = starshipData.concat(data.results)
        url = data.next
      }
      // set row data field to our list of starships
      setRowData(starshipData)
    }

    // call our async function to fetch multiple pages of Star Wars starship data
    fetchStarshipData();
  }, [])

  /*
    create AG-grid using built-in theme and assign static height*
    assign default column definitions:
          flex sizing to divide remaining space
          wrapText and wrapHeaderText with auto-adjusted heights to fit long text values within the columns of our table
          basic sortability (ascending/descending)
          filter using text searches by default for columns that weren't assigned the NumberColumnFilter 
          buttons for applying the filter, clearing the filter options, and resetting the full table
  */
  return (
    <div>
      <div className='ag-theme-alpine' style={{ height: 800 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          animateRows={true}
          defaultColDef={{
            flex: 1,
            wrapText: true,
            autoHeight: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            sortable: true,
            filter: true,
            filterParams: { buttons: ['apply', 'clear', 'reset'] }
          }}>
        </AgGridReact>
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>Starships Grid</h1>
      </div>
    </div>
  )
}

export default App;
