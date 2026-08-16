import { List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

type HomePageProps = {
  routes: string[];
};

export default function HomePage({ routes }: HomePageProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">관리 홈</Typography>
      <List>
        {routes.map((route) => (
          <ListItemButton key={route} component={Link} to={route}>
            <ListItemText primary={route} />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
}
