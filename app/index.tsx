import { Redirect } from "expo-router";
import React from "react";

export default function IndexScreen() {
  // Redirect to simple demo screen to show the work completed
  return <Redirect href="/demo" />;
}
