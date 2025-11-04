'use client';

import React, { use } from "react";
import VehicleSaleDetail from "./VehicleSaleDetail"; 

export default function Page({ params }) {
  const { id } = use(params);

  return <VehicleSaleDetail saleId={id} />;
}
