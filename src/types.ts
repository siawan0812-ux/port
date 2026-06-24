import React from "react";

export interface PortfolioPage {
  id: number;
  section: string;
  title: string;
  subtitle?: string;
  render: () => React.JSX.Element;
}
