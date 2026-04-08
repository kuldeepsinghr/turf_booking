import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SlotPicker from "../components/SlotPicker";
import { useTurf } from "../context/TurfContext";

export default function TurfDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedTurf, fetchTurfById, loading, error } = useTurf();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchTurfById(id, date);
  }, [id, date]);

  if (loading) {
    return <div className="text-white p-5">Loading turf...</div>;
  }

  if (error) {
    return <div className="text-red-400 p-5">{error}</div>;
  }

  if (!selectedTurf) {
    return <div className="text-white p-5">Turf not found</div>;
  }

  return (
    <SlotPicker
      turf={selectedTurf}
      selectedDate={date}
      onDateChange={setDate}
      onBack={() => navigate("/")}
    />
  );
}