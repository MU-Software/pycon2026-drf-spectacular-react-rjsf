import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Not Found</Typography>
      <Typography>페이지를 찾을 수 없습니다.</Typography>
      <Button variant="outlined" component={Link} to="/">홈으로</Button>
    </Stack>
  );
}
