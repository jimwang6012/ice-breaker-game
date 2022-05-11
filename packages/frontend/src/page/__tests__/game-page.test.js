import { BrowserRouter } from "react-router-dom";
import GamePage from "../IdlePage";
import { render } from "@testing-library/react";

it("renders correctly", () => {
  const tree = render(
    <BrowserRouter>
      <GamePage />
    </BrowserRouter>
  );
  expect(tree).toMatchSnapshot();
});
