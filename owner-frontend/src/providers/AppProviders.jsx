import { TurfProvider } from "../context/TurfContext";
import { SlotProvider } from "../context/SlotContext";
import { BookingProvider } from "../context/BookingContext";

const AppProviders = ({ children }) => {
  return (
    <TurfProvider>
      <SlotProvider>
        <BookingProvider>
          {children}
        </BookingProvider>
      </SlotProvider>
    </TurfProvider>
  );
};

export default AppProviders;