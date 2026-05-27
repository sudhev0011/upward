import { ClientProviderListItem } from '@/interfaces/provider/provider.listing.interface';
import { Star, MapPin, Briefcase, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  provider: ClientProviderListItem;
}

export const ProviderCard = ({ provider }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={provider.avatarUrl ?? ''} />
          <AvatarFallback className="bg-[#719FC4] text-white font-bold">
            {provider.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-black text-gray-900 tracking-tight truncate">
            {provider.name}
          </h3>
          {provider.location && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={11} />
              {provider.location.address}
            </p>
          )}
        </div>

        {/* Rating badge */}
        <div className="ml-auto flex items-center gap-1 bg-amber-50 text-amber-600 rounded-lg px-2 py-1 shrink-0">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold">{provider.ratingAvg.toFixed(1)}</span>
        </div>
      </div>

      {/* Bio */}
      {provider.bio && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {provider.bio}
        </p>
      )}

      {/* Experience */}
      {provider.experience && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Briefcase size={12} />
          <span>{provider.experience}</span>
        </div>
      )}

      {/* Skills */}
      {provider.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {provider.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-gray-50 text-gray-500 border border-gray-100 rounded-lg px-2.5 py-1 font-medium"
            >
              {skill}
            </span>
          ))}
          {provider.skills.length > 3 && (
            <span className="text-xs text-gray-400 py-1">
              +{provider.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {provider.ratingCount} review{provider.ratingCount !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => navigate(`/providers/${provider.userId}`)}
          className="flex items-center gap-1 text-xs font-bold text-[#719FC4] hover:text-[#5585A8] transition-colors"
        >
          View Profile <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
};