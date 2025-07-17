import { motion } from "framer-motion";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Profile from "@/components/pages/Profile";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

function ProfileCard({ profile, onViewProfile, onLike, onPass, className, ...props }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    } catch {
      return false;
    }
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
const handleImageError = () => {
    console.warn('Failed to load image:', profile?.photo);
    setImageError(true);
    setImageLoading(false);
  };
  
// Validate image URL on mount
  React.useEffect(() => {
    if (!isValidImageUrl(profile?.photo)) {
      setImageError(true);
      setImageLoading(false);
    }
  }, [profile?.photo]);
  
  const showActions = onLike && onPass;
  
  return (
    <Card hover className="p-0 overflow-hidden">
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
          {!imageError ? (
            <>
              {imageLoading && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                  <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              )}
<img
                src={profile?.photo}
                alt={profile?.name || 'Profile'}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <ApperIcon name="User" className="w-16 h-16 text-primary-400" />
            </div>
          )}
        </div>
        
<div className="absolute top-4 right-4">
          <Badge variant="primary" size="md">
            {profile?.compatibilityScore || 0}% Match
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-display font-semibold text-gray-800">
              {profile?.name || 'Unknown'}
            </h3>
            <p className="text-gray-600">{profile?.age || 'N/A'} • {profile?.location || 'Unknown'}</p>
          </div>
          <Badge variant="secondary" size="sm">
            {profile?.mbtiType || 'N/A'}
          </Badge>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">
          {profile?.bio || 'No bio available'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {profile?.loveLanguages?.slice(0, 2).map((language, index) => (
            <Badge key={index} variant="primary" size="sm">
              <ApperIcon name="Heart" className="w-3 h-3 mr-1" />
              {language}
            </Badge>
          )) || []}
        </div>
        
        {showActions && (
          <div className="flex space-x-3">
<Button
              variant="outline"
              size="sm"
              onClick={() => onPass(profile.id)}
              className="flex-1"
            >
              <ApperIcon name="X" className="w-4 h-4 mr-2" />
              Pass
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onLike(profile.id)}
              className="flex-1"
            >
              <ApperIcon name="Heart" className="w-4 h-4 mr-2" />
              Like
            </Button>
          </div>
        )}
        
<Button
          variant="ghost"
          size="sm"
          onClick={() => onViewProfile(profile.id)}
          className="w-full mt-2"
        >
          View Full Profile
        </Button>
      </div>
    </Card>
  );
}

export default ProfileCard;