import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { AppContextProvider } from "../../AppContextProvider";
import HomePage from "../HomePage";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <AppContextProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AppContextProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
