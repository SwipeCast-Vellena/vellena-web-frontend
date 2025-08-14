import React from "react";
import { useParams } from "react-router-dom";
import CampaignDetailScreen from "../components/CampaignDetailScreen";
import { useCampaignStore } from "../stores/campaignStore"; // ✅ Zustand store
import { applyToCampaign } from "../services/applicationService"; // import service


export const CampaignDetailRoute = ({
  onBack,
  onApply,
}: {
  onBack: () => void;
  onApply: () => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const campaigns = useCampaignStore((state) => state.campaigns); // get all campaigns

  // Find the campaign from store
  const campaignData = campaigns.find((c) => c.id === Number(id));

  if (!campaignData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Campagna non trovata
      </div>
    );
  }

  // Calculate time left
  const deadlineDate = new Date(campaignData.deadline);
  const diffTime = deadlineDate.getTime() - new Date().getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const timeLeft = daysLeft > 0 ? `${daysLeft} giorni rimasti` : "Scaduto";

  // Map to CampaignDetailScreen expected shape
  const campaign = {
    id: campaignData.id,
    title: campaignData.title,
    agency: campaignData.agency_name,
    description: campaignData.description,
    deadline: campaignData.deadline,
    timeLeft,
    requirements: {
      gender:
        campaignData.gender_preference === "any"
          ? "Qualsiasi"
          : campaignData.gender_preference === "women"
          ? "Femminile"
          : "Maschile",
      location: `${campaignData.city}${campaignData.address ? ", " + campaignData.address : ""}`,
      startDate: campaignData.start_date,
      endDate: campaignData.end_date,
    },
    budget: `€${campaignData.compensation}`,
    applicants: campaignData.application_count,
  };

  const handleApply = async () => {
  if (!campaignData) return;
  try {
    await applyToCampaign(campaignData.id); // call backend
    alert("Candidatura inviata con successo!");
    
    // Optional: update applicants in Zustand
    useCampaignStore.getState().updateApplicationCount(campaignData.id);
  } catch (err: any) {
    alert(err.message || "Errore nell'inviare la candidatura");
  }
};

  return <CampaignDetailScreen campaign={campaign} onBack={onBack} onApply={handleApply} />;
};
