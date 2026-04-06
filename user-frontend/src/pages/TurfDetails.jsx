import { useParams, useNavigate } from "react-router-dom";
import SlotPicker from "../components/SlotPicker";
import { turfs } from "../data/turfs";

export default function TurfDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const turf = turfs.find((t) => t.id === Number(id));

  if (!turf) {
    return <div className="text-white p-5">Turf not found</div>;
  }

  return (
    <SlotPicker
      turf={turf}
      onBack={() => navigate("/")}
    />
  );
}