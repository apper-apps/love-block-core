import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ProfileSetup from "@/components/organisms/ProfileSetup";
import Discover from "@/components/pages/Discover";
import Simulation from "@/components/pages/Simulation";
import CompatibilityMeter from "@/components/molecules/CompatibilityMeter";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { userService } from "@/services/api/userService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
    console.warn('Failed to load profile image:', profile?.photo);
    setImageError(true);
    setImageLoading(false);
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getCurrentUser();
      
      if (data) {
        setProfile(data);
        if (!isValidImageUrl(data.photo)) {
          setImageError(true);
          setImageLoading(false);
        } else {
          setImageError(false);
          setImageLoading(true);
        }
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = (newProfile) => {
    setProfile(newProfile);
    toast.success('Profile created successfully!');
  };

  useEffect(() => {
    loadProfile();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6 pb-20">
          <Loading type="form" />
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
              Create Your Profile
            </h1>
            <p className="text-gray-600">
              Let's set up your psychological dating profile
            </p>
          </motion.div>
          
          <ProfileSetup onProfileComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text">
              My Profile
            </h1>
            <p className="text-gray-600 mt-1">
              Your psychological dating profile
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </motion.div>
        
        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
                    {!imageError ? (
                      <>
                        {imageLoading && (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                          </div>
                        )}
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <ApperIcon name="User" className="w-12 h-12 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <ApperIcon name="Check" className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-display font-bold text-gray-800">
                      {profile.name}
                    </h2>
                    <Badge variant="secondary" size="md">
                      {profile.mbtiType}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {profile.age} • {profile.location}
                  </p>
                  
                  <p className="text-gray-700 mb-4">
                    {profile.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.loveLanguages.map((language, index) => (
                      <Badge key={index} variant="primary" size="sm">
                        <ApperIcon name="Heart" className="w-3 h-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Compatibility Stats */}
            <Card className="p-6 text-center">
              <h3 className="font-display font-semibold text-gray-800 mb-4">
                Profile Strength
              </h3>
              <CompatibilityMeter
                score={85}
                size="lg"
                showLabel={false}
                className="mb-4"
              />
              <p className="text-sm text-gray-600">
                Your profile is 85% complete
              </p>
            </Card>
            
            {/* Activity Stats */}
            <Card className="p-6">
              <h3 className="font-display font-semibold text-gray-800 mb-4">
                Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Eye" className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-gray-600">Profile Views</span>
                  </div>
                  <span className="font-semibold text-gray-800">24</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Heart" className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-gray-600">Likes Received</span>
                  </div>
                  <span className="font-semibold text-gray-800">12</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="MessageSquare" className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-gray-600">Conversations</span>
                  </div>
                  <span className="font-semibold text-gray-800">5</span>
                </div>
              </div>
            </Card>
            
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-display font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = "/"}
                >
                  <ApperIcon name="Compass" className="w-4 h-4 mr-2" />
                  Discover More
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = "/simulation"}
                >
                  <ApperIcon name="MessageSquare" className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;