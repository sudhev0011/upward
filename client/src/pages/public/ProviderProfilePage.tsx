import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MapPin,
  Briefcase,
  Star,
  Globe,
  Phone,
  ArrowLeft,
  Languages,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProviderProfile } from "@/hooks/public/providers/useGetProviderProfile";
import { PortfolioSection } from "@/components/common/portfolio/PortfolioSection";
import { AvailabilitySection } from "@/components/common/availability/AvailabilitySection";
import { ServicesSection } from "@/components/common/provider-service/ServiceSection";
import { useAppSelector } from "@/hooks/useRedux";
import { chatApi } from "@/api/chat.api";
import { ReviewsSection } from "@/components/common/reviews/ReviewsSection";

type Tab = "services" | "portfolio" | "availability" | "reviews";

export const ProviderProfilePage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("services");

  const currentUser = useAppSelector((state) => state.auth.user);
  const isClient = currentUser?.roles?.includes("client");
  const [isMessaging, setIsMessaging] = useState(false);

  const { data, isLoading, isError } = useGetProviderProfile(providerId!);
  const provider = data?.data;

  const handleMessageProvider = async () => {
    if (!providerId) return;
    setIsMessaging(true);
    try {
      const response = await chatApi.findOrCreateConversation(providerId);
      if (response.success && response.data) {
        navigate("/client/dashboard/messages", {
          state: { conversationId: response.data.id },
        });
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsMessaging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 space-y-6">
          <div className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
          <div className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100" />
          <div className="h-96 bg-white rounded-2xl animate-pulse border border-gray-100" />
        </div>
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-gray-400 text-sm">Provider not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#719FC4] text-sm font-bold hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={15} /> Back to listings
        </button>

        {/* ── Profile Card ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          {/* Header row */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={provider.avatarUrl ?? ""} />
              <AvatarFallback className="bg-[#719FC4] text-white text-xl font-black">
                {provider.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-gray-900">
                    {provider.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    {provider.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={11} /> {provider?.location.address}
                      </span>
                    )}
                    {provider.experience && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Briefcase size={11} /> {provider.experience}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions (Rating / Message) */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 rounded-xl px-3 py-1.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold">
                      {provider.ratingAvg.toFixed(1)}
                    </span>
                    <span className="text-xs text-amber-400">
                      ({provider.ratingCount})
                    </span>
                  </div>

                  {isClient && (
                    <button
                      onClick={handleMessageProvider}
                      disabled={isMessaging}
                      className="flex items-center gap-1.5 rounded-xl bg-[#719FC4] hover:bg-[#5585A8] px-4 py-2 text-xs font-bold text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      <MessageSquare size={13} />
                      {isMessaging ? "Starting..." : "Message"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {provider.bio && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {provider.bio}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 pt-1">
            {provider.languages.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Languages size={13} className="text-gray-400" />
                {provider.languages.join(", ")}
              </div>
            )}
            {provider.phone && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Phone size={13} className="text-gray-400" />
                {provider.phone}
              </div>
            )}
          </div>

          {/* Skills */}
          {provider.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {provider.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-gray-50 border border-gray-100 text-gray-500 rounded-lg px-2.5 py-1 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Categories */}
          {provider.categories && provider.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {provider.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-[#EEF5FB] text-[#4A86B0] border border-[#C8DFF0] rounded-lg px-2.5 py-1 font-bold capitalize"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {provider.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {provider.socialLinks.map(
                (link) =>
                  link.link && (
                    <a
                      key={link.name}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#719FC4] font-bold hover:text-[#5585A8] border border-[#C8DFF0] rounded-lg px-3 py-1.5 hover:bg-[#EEF5FB] transition-colors"
                    >
                      <Globe size={11} />
                      {link.name}
                      <ChevronRight size={10} />
                    </a>
                  ),
              )}
            </div>
          )}
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {(["services", "portfolio", "availability", "reviews"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-bold capitalize transition-colors ${
                  activeTab === tab
                    ? "text-[#719FC4] border-b-2 border-[#719FC4] -mb-px"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === "services" && (
              <ServicesSection providerId={providerId!} providerName={provider.name}/>
            )}
            {activeTab === "portfolio" && (
              <PortfolioSection providerId={providerId!} />
            )}
            {activeTab === "availability" && (
              <AvailabilitySection providerId={providerId!} />
            )}
            {activeTab === "reviews" && (
              <ReviewsSection providerId={providerId!} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
