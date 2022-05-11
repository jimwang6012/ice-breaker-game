import { BrowserRouter, Router } from "react-router-dom";
import IdlePage from "../IdlePage";
import { render } from "@testing-library/react";

it("renders correctly", () => {
  const tree = render(
    <BrowserRouter>
      <IdlePage />
    </BrowserRouter>
  );
  expect(tree).toMatchSnapshot();
});
