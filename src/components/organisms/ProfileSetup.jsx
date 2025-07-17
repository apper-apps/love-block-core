import { motion } from "framer-motion";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import MBTISelector from "@/components/molecules/MBTISelector";
import FormField from "@/components/molecules/FormField";
import LoveLanguageCard from "@/components/molecules/LoveLanguageCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { userService } from "@/services/api/userService";

const ProfileSetup = ({ onProfileComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    location: "",
    bio: "",
    mbtiType: "",
    loveLanguages: [],
    photo: ""
  });
  
  const loveLanguages = [
    "Words of Affirmation",
    "Acts of Service", 
    "Receiving Gifts",
    "Quality Time",
    "Physical Touch"
  ];
  
  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleMBTISelect = (type) => {
    setProfile(prev => ({ ...prev, mbtiType: type }));
  };
  
  const handleLoveLanguageSelect = (language) => {
    setProfile(prev => {
      const currentLanguages = prev.loveLanguages;
      if (currentLanguages.includes(language)) {
        return {
          ...prev,
          loveLanguages: currentLanguages.filter(l => l !== language)
        };
      } else if (currentLanguages.length < 3) {
        return {
          ...prev,
          loveLanguages: [...currentLanguages, language]
        };
      }
      return prev;
    });
  };
  
const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const newProfile = await userService.createProfile({
          ...profile,
          photo: `https://ui-avatars.com/api/?name=${profile.name}&background=e91e63&color=fff&size=400`
        });
        
        if (newProfile) {
          onProfileComplete(newProfile);
        }
      } catch (error) {
        console.error('Failed to create profile:', error);
      }
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.name && profile.age && profile.location && profile.bio;
      case 2:
        return profile.mbtiType;
      case 3:
        return profile.loveLanguages.length > 0;
      default:
        return false;
    }
  };
  
  const progress = (step / 3) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress Bar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {step} of 3
          </span>
          <span className="text-sm font-medium text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>
      </Card>
      
      {/* Step 1: Basic Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-2">
                Tell us about yourself
              </h2>
              <p className="text-gray-600">
                Let's start with some basic information to create your profile.
              </p>
            </div>
            
            <div className="space-y-4">
              <FormField
                label="Full Name"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Your age"
                  required
                />
                
                <FormField
                  label="Location"
                  value={profile.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, Country"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio <span className="text-error">*</span>
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself, your interests, and what you're looking for..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-white min-h-[120px] resize-none"
                  required
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Step 2: MBTI Type */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-2">
                What's your MBTI type?
              </h2>
              <p className="text-gray-600">
                Select your Myers-Briggs personality type to help us find compatible matches.
              </p>
            </div>
            
            <MBTISelector
              selectedType={profile.mbtiType}
              onTypeSelect={handleMBTISelect}
            />
          </Card>
        </motion.div>
      )}
      
      {/* Step 3: Love Languages */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-semibold text-gray-800 mb-2">
                What are your love languages?
              </h2>
              <p className="text-gray-600">
                Select up to 3 love languages that resonate with you the most.
              </p>
            </div>
            
            <div className="space-y-4">
              {loveLanguages.map((language) => (
                <LoveLanguageCard
                  key={language}
                  language={language}
                  isSelected={profile.loveLanguages.includes(language)}
                  onSelect={handleLoveLanguageSelect}
                />
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Selected: {profile.loveLanguages.length} / 3
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          {step === 3 ? "Complete Profile" : "Next"}
          <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileSetup;