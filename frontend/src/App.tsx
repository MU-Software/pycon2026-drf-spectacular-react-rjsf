import { AppBar, Button, Container, Toolbar } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">ADMIN</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ py: 3 }}><Outlet /></Container>
    </>
  );
}
