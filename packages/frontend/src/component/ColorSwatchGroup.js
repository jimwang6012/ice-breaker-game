import { ColorSwatch, Group, SimpleGrid } from "@mantine/core";
import { CheckIcon, CircleBackslashIcon } from "@radix-ui/react-icons";

export function ColorSwatchGroup(props) {
  const swatches = props.colorStrings.map((color, index) => {
    return (
      <ColorSwatch
        key={index}
        color={color}
        size={32}
        component="button"
        disabled={!props.colorStatus[index] && !props.isReady ? false : true}
        radius="md"
        onClick={() => props.handleClick(index)}
        style={{ color: "#000000" }}
      >
        {props.colorStatus[index] &&
          (!props.isReady || index !== props.colorChecked) && (
            <CircleBackslashIcon />
          )}
        {index === props.colorChecked &&
          !(props.colorStatus[index] && !props.isReady) && <CheckIcon />}
      </ColorSwatch>
    );
  });

  return (
    <Group position="center">
      <SimpleGrid cols={3} spacing="xs">
        {swatches}
      </SimpleGrid>
    </Group>
  );
}
