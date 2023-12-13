import { BoxProps } from "../Box";

export interface NavTabProps extends BoxProps {
  activeIndex?: number;
  onItemClick: (index: number) => void;
}
