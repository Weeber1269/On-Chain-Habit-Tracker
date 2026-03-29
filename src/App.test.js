import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders habit tracker title", () => {
  render(<App />);
  const title = screen.getByText(/On Chain Habit Tracker/i);
  expect(title).toBeInTheDocument();
});
