import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const KPICard = ({ title, value }) => (
  <Card sx={{ minWidth: 200, backgroundColor: "#f3f4f6", margin: "1rem" }}>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4" color="primary">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default KPICard;
