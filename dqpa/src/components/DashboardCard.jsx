import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const DashboardCard = ({ title, description, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      minWidth: 275,
      cursor: "pointer",
      transition: "0.3s",
      "&:hover": { boxShadow: 6 },
    }}
  >
    <CardContent>
      <Typography variant="h5" component="div">
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </CardContent>
  </Card>
);

export default DashboardCard;
