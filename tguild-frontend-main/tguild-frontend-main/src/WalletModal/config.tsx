import Metamask from "./icons/Metamask";
import { Config, ConnectorNames } from "./types";

const connectors: Config[] = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: ConnectorNames.Injected,
    redirectUrl: `https://metamask.app.link/dapp/${window.location.href.replace(/^https?:\/\//, "")}`,
  },
];

export default connectors;
export const connectorLocalStorageKey = "connectorId";
export const walletLocalStorageKey = "wallet";

