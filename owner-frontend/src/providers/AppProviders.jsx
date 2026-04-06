import { TurfProvider } from "../context/TurfContext";
import { SlotProvider } from "../context/SlotContext";

const AppProviders = ({ children }) => {
  return (
    <TurfProvider>
      <SlotProvider>
        {children}
      </SlotProvider>
    </TurfProvider>
  );
};

export default AppProviders;