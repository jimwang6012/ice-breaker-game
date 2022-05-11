import { BrowserRouter } from "react-router-dom";
import RoomPageLayout from "../RoomPageLayout";
import { MantineProvider } from "@mantine/core";

import { render } from "@testing-library/react";

it("renders correctly", () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
  }

  // @ts-ignore
  window.ResizeObserver = ResizeObserver;
  const tree = render(
    <BrowserRouter>
      <MantineProvider
        emotionOptions={{ key: "mantine", prepend: false }}
        // @ts-ignore
        withCSSVariables
        theme={{
          colors: {
            ice: [
              "#DDEEF8",
              "#C5E0F5",
              "#9EBFE0",
              "#5C83A0",
              "#04AED9",
              "#0478A1",
              "#003853",
              "#041F32",
              "#768EAA",
              "#768EAA",
            ],
          },
        }}
        styles={{
          Button: (theme) => ({
            filled: {
              // subscribe to component params
              color: "white",
              background: theme.colors.ice[6],
              "&:hover": {
                backgroundColor: theme.colors.ice[6],
              },
            },
          }),
        }}
      >
        <RoomPageLayout />
      </MantineProvider>
    </BrowserRouter>
  );
  expect(tree).toMatchSnapshot();
});
