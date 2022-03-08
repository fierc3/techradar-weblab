import '../App.css';
import { config, CATEGORY, RING, ROLE, getEnumText } from '../Constants';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditDialog from './EditDialog';
import LoginDialog from './LoginDialog'
import { Container, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryDialog from './HistoryDialog';


var ENDPOINT = config.url.API_URL;

const Overview = () => {
  const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });

  const [edit, setEdit] = React.useState(false);
  const [history, setHistory] = React.useState(false);
  const [historyId, setHistoryId] = React.useState(0);
  const [login, setLogin] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [data, setData] = React.useState([]);
  const [editData, setEditData] = React.useState(undefined);

  const handleEditClick = (data) => {
    setEditData(data);
    setEdit(true);
  };

  const handleHistoryClick = (id) => {
    setHistoryId(id);
    setHistory(true);
  };

  const getOffsetLeft = (cat) => {
    switch (cat) {
      case RING.Assess:
        return 220
      case RING.Trial:
        return 160
      case RING.Adopt:
        return 80
      default:
        return 1
    }

  }

  const getOffsetRight = (cat) => {
    return 300 - getOffsetLeft(cat);
  }

  const handleNewClick = () => {
    setEditData(undefined);
    setEdit(true);
  };

  const updateData = async () => {
    const response = await fetch(ENDPOINT + "/api/tech");
    const json = await response.json();
    if (json.message !== undefined && json.message === 'success') {
      setData(json.data);
    }
  }

  React.useEffect(() => {
    updateData();
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setLoggedIn(true);
      setUser(loggedInUser)
    } else {
      setLoggedIn(false);
      setUser({})
    }
  }, [login, edit]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar id="toolbar">
            <Typography
              id='smallTitle'
              component="h2"
              variant="h5"
              color="inherit"
              align="left"
              noWrap
              sx={{ flex: 1 }}
            >🐺</Typography>
            <Typography
              id='largeTitle'
              component="h2"
              variant="h5"
              color="inherit"
              align="left"
              noWrap
              sx={{ flex: 1 }}
            >TECHRADAR by fierc3 🐺</Typography>
            <Button variant="text" size="small" color="primary" onClick={() => {
              if (isLoggedIn) {
                setLogin(false);
                setLoggedIn(false);
                localStorage.clear();
                document.location.reload();
              } else {
                setLogin(true)
              }
            }}>
              <Typography
                component="p"
                color="white"
                align="right"
                noWrap
                sx={{ flex: 1 }}
              >{isLoggedIn === false ? "Sign In" : "Sign out"}</Typography>
            </Button>
          </Toolbar>
        </AppBar>
        {isLoggedIn === false ?
          <Typography style={{ paddingTop: "40vh" }} variant="h6" align="center" gutterBottom>
            Please Login To View / Edit Tech Radar
          </Typography>
          :
          <main>
            <Box
              id="radar-hint"
              sx={{
                bgcolor: 'background.paper',
                pt: 7,
                pb: 1,
                height: "1vh"
              }}
            >
              <Typography gutterBottom variant="caption" align="center">Screen too small to display the radar chart</Typography>
            </Box>
            {/* Hero unit for Radar */}
            <Box
              id="radar"
              sx={{
                bgcolor: 'background.paper',
                pt: 10,
                pb: 6,
                height: "60vh"
              }}
            >
              <Container style={{ minWidth: "600px", minHeight: "400px" }} maxWidth="sm" >
                <Card
                  sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {data.filter(x => x.public === 1 || user.role === ROLE.Admin).map((tech) => (<span
                      key={tech.tech_id}
                      style={{
                        fontSize: "9px",
                        position: "absolute",
                        paddingTop: tech.category < 3 ? 5 + (Math.random() * 15) + "vh" : 25 + (Math.random() * 20) + "vh",
                        paddingLeft: tech.category === CATEGORY.Languages || tech.category === CATEGORY.Tools ? 200 + getOffsetRight(tech.ring) + "px" : 1 + getOffsetLeft(tech.ring) + "px"
                      }}
                    >
                      🔴{tech.name}</span>))}

                    <div style={{ display: "flex", flexFlow: "row wrap" }}>
                      <div style={{ display: "flex", flexFlow: "row wrap", flexBasis: "50%", borderBottom: "2px solid black", height: "25vh" }}>

                        <div style={{ flexBasis: "100%" }}>
                          <span>Techniques</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderRight: "1px solid black" }}>
                          <span>Hold</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderRight: "1px solid black" }}>
                          <span>Adopt</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderRight: "1px solid black" }}>
                          <span>Trial</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderRight: "1px solid black" }}>
                          <span>Assess</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexFlow: "row wrap", flexBasis: "50%", borderBottom: "2px solid black", height: "25vh" }}>

                        <div style={{ flexBasis: "100%" }}>
                          <span>Tools</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderLeft: "1px solid black" }}>
                          <span>Assess</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderLeft: "1px solid black" }}>
                          <span>Trial</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderLeft: "1px solid black" }}>
                          <span>Adopt</span>
                        </div>
                        <div style={{ flexBasis: "25%", height: "45vh", borderLeft: "1px solid black" }}>
                          <span>Hold</span>
                        </div>
                      </div>

                      <div style={{ flexBasis: "50%", height: "25vh" }}>
                        <span>Platforms</span>
                      </div>
                      <div style={{ flexBasis: "50%" }}>
                        <span>Languages & Frameworks</span>
                      </div>

                    </div>
                    <Typography gutterBottom variant="caption" >
                      <br />
                      Viewing as {user.display !== undefined ? user.display : "Guest"}
                    </Typography>
                  </CardContent>
                </Card>
              </Container>
            </Box>
            <Container sx={{ py: 8, pt: 10 }} maxWidth="md">
              {isLoggedIn && user.role === ROLE.Admin ? <Fab color="primary" aria-label="add" onClick={handleNewClick}>
                <AddIcon />
              </Fab>
                : <div style={{ height: "60px" }}></div>
              }
              {/* End hero unit */}
              <Grid container spacing={4}>
                {data.filter(x => x.public === 1 || user.role === ROLE.Admin).map((tech) => (
                  <Grid item key={tech.tech_id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {tech.name}
                          {tech.public === 0 && <span>(UNPUBLISHED)</span>}
                        </Typography>
                        <Typography variant="body1">
                          {tech.description} <br />
                          {tech.description_decision} <br />
                          <b>Ring:</b> {getEnumText(tech.ring, RING)} <br />
                          <b>Category:</b> {getEnumText(tech.category, CATEGORY)} <br />
                        </Typography>
                        <Typography variant="caption"
                          color="text.secondary"
                          component="p">
                          Last modified on {new Date(tech.save_date).toLocaleString("en-US")}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {(isLoggedIn && user.role === ROLE.Admin) && <Button onClick={() => handleEditClick(tech)} size="small">Edit</Button>}
                        <Button onClick={() => handleHistoryClick(tech.tech_id)} size="small">History</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </main>
        }
        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', pt: "6" }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Thank you for trying out the tech radar!
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Find more projects on github @fierc3
          </Typography>
        </Box>
        {/* End footer */}
      </ThemeProvider>
      <EditDialog open={edit} data={editData} handleClose={() => setEdit(false)}></EditDialog>
      <HistoryDialog open={history} tech_id={historyId} handleClose={() => setHistory(false)}></HistoryDialog>
      <LoginDialog open={login} handleClose={() => setLogin(false)}></LoginDialog>
    </>
  );
}

export default Overview;