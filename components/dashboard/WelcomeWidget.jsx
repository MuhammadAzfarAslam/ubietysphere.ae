"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";

const WelcomeWidget = ({ user, imageUrl }) => {
  const pathname = usePathname();

  // Generate initials from user name
  const getInitials = () => {
    const firstName = user?.name || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Use primary color for avatar background
  const getAvatarColor = () => {
    return "bg-primary";
  };

  // Dynamic messages based on current page
  const getContextualMessage = () => {
    if (pathname === "/dashboard") {
      return {
        greeting: "Welcome, Health Seeker!",
        message: "Let's keep your health journey on track today.",
        icon: "🌟",
      };
    } else if (pathname.includes("appointment-room")) {
      return {
        greeting: "Your Appointments",
        message: "Manage your healthcare consultations seamlessly.",
        icon: "📅",
      };
    } else if (pathname.includes("my-documents")) {
      return {
        greeting: "Your Health Records",
        message: "Keep your medical documents organized and accessible.",
        icon: "📋",
      };
    }
    return {
      greeting: "Welcome Back!",
      message: "Your health is our priority.",
      icon: "💚",
    };
  };

  const contextMessage = getContextualMessage();

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-white border border-primary/20 rounded-lg p-4 mb-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-secondary/30 shadow-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={user?.name || "User"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className={`w-full h-full ${getAvatarColor()} flex items-center justify-center`}>
              <span className="text-secondary text-xl font-bold">{getInitials()}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">
            {user?.name} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Contextual Message */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{contextMessage.icon}</span>
          <h3 className="text-base font-bold text-gray-800">{contextMessage.greeting}</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{contextMessage.message}</p>
      </div>

      {/* Quick Stats or Tip */}
      <div className="mt-4 pt-3 border-t border-primary/10">
        <p className="text-xs text-gray-500 italic">
          💡 Tip: Keep your profile updated for a personalized experience.
        </p>
      </div>
    </div>
  );
};

export default WelcomeWidget;
