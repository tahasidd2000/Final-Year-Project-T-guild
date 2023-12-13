
export const baseColors = {
  failure: "#ED4B9E",
  primary: "#2BA55D",
  primaryBright: "lightgreen",
  primaryDark: "#0098A1",
  secondary: "#7645D9",
  success: "#31D0AA",
  successDark: "#126954",
  warning: "#FFB237",
  default: "#FFFFFF",
  info: "#3FAFD2",

  sidebarBackground: "#000f18",
  sidebarColor: "white",
  sidebarActiveColor: "#00997a",
  menuItemBackground: "#011724",
  menuItemActiveBackground: "#008b74",
  inputColor: "#284859",
  dropdownBackground: "#00121d",
  linkColor: "#00d4a4"
};

export const brandColors = {
  binance: "#F0B90B",
};

export const lightColors = {
  ...baseColors,
  ...brandColors,
  background: "#24243e",
  backgroundDisabled: "#444444",
  contrast: "#191326",
  invertedContrast: "#FFFFFF",
  input: "#000f18",
  inputSecondary: "#d7caec",
  tertiary: "#EFF4F5",
  text: "#FFFFFF",
  textDisabled: "#BDC2C4",
  textSubtle: "#BDC2C4",
  borderColor: "#E9EAEB",
  card: "#000f18",
  gradients: {
    bubblegum: "linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)",
  },
};

export const darkColors = {
  ...baseColors,
  ...brandColors,
  secondary: "#9A6AFF",
  background: "#011d2c",
  backgroundDisabled: "#3c3742",
  contrast: "#FFFFFF",
  invertedContrast: "#191326",
  input: "#483f5a",
  inputSecondary: "#66578D",
  primaryDark: "#0098A1",
  tertiary: "#353547",
  text: "#FFFFFF",
  textDisabled: "#666171",
  textSubtle: "#FFFFFF",
  borderColor: "#524B63",
  card: "#000f18",
  gradients: {
    bubblegum: "linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)",
  },
};
