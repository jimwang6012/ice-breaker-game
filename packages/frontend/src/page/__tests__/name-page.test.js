import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { AppContextProvider } from "../../AppContextProvider";
import NamePage from "../NamePage";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <AppContextProvider>
        <BrowserRouter>
          <NamePage />
        </BrowserRouter>
      </AppContextProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
