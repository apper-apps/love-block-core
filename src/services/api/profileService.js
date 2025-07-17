import { toast } from 'react-toastify';

class ProfileService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }
  
  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }
  
  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "age" } },
          { field: { Name: "location" } },
          { field: { Name: "photo" } },
          { field: { Name: "bio" } },
          { field: { Name: "mbti_type" } },
          { field: { Name: "love_languages" } },
          { field: { Name: "compatibility_score" } },
          { field: { Name: "interests" } },
          { field: { Name: "is_online" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('user_profile', params);
      
      if (!response.success) {
        console.error("Error fetching profiles:", response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching profiles:", error?.response?.data?.message);
      } else {
        console.error("Error fetching profiles:", error.message);
      }
      return [];
    }
  }
  
  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "age" } },
          { field: { Name: "location" } },
          { field: { Name: "photo" } },
          { field: { Name: "bio" } },
          { field: { Name: "mbti_type" } },
          { field: { Name: "love_languages" } },
          { field: { Name: "compatibility_score" } },
          { field: { Name: "interests" } },
          { field: { Name: "is_online" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('user_profile', id, params);
      
      if (!response.success) {
        console.error("Error fetching profile:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching profile with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching profile with ID ${id}:`, error.message);
      }
      return null;
    }
  }
  
  async create(profile) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: profile.name || profile.Name,
            age: parseInt(profile.age),
            location: profile.location,
            photo: profile.photo,
            bio: profile.bio,
            mbti_type: profile.mbtiType || profile.mbti_type,
            love_languages: Array.isArray(profile.loveLanguages) ? profile.loveLanguages.join(',') : profile.love_languages,
            compatibility_score: profile.compatibilityScore || profile.compatibility_score || Math.floor(Math.random() * 30) + 70,
            interests: Array.isArray(profile.interests) ? profile.interests.join(',') : profile.interests || '',
            is_online: profile.isOnline !== undefined ? profile.isOnline : profile.is_online !== undefined ? profile.is_online : true
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('user_profile', params);
      
      if (!response.success) {
        console.error("Error creating profile:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create profile ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Profile created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating profile:", error?.response?.data?.message);
      } else {
        console.error("Error creating profile:", error.message);
      }
      return null;
    }
  }
  
  async update(id, data) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.name !== undefined || data.Name !== undefined) updateData.Name = data.name || data.Name;
      if (data.age !== undefined) updateData.age = parseInt(data.age);
      if (data.location !== undefined) updateData.location = data.location;
      if (data.photo !== undefined) updateData.photo = data.photo;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.mbti_type !== undefined || data.mbtiType !== undefined) updateData.mbti_type = data.mbti_type || data.mbtiType;
      if (data.love_languages !== undefined || data.loveLanguages !== undefined) {
        const loveLanguages = data.love_languages || data.loveLanguages;
        updateData.love_languages = Array.isArray(loveLanguages) ? loveLanguages.join(',') : loveLanguages;
      }
      if (data.compatibility_score !== undefined || data.compatibilityScore !== undefined) updateData.compatibility_score = data.compatibility_score || data.compatibilityScore;
      if (data.interests !== undefined) updateData.interests = Array.isArray(data.interests) ? data.interests.join(',') : data.interests;
      if (data.is_online !== undefined || data.isOnline !== undefined) updateData.is_online = data.is_online !== undefined ? data.is_online : data.isOnline;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('user_profile', params);
      
      if (!response.success) {
        console.error("Error updating profile:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update profile ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Profile updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating profile:", error?.response?.data?.message);
      } else {
        console.error("Error updating profile:", error.message);
      }
      return null;
    }
  }
  
  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('user_profile', params);
      
      if (!response.success) {
        console.error("Error deleting profile:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete profile ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Profile deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting profile:", error?.response?.data?.message);
      } else {
        console.error("Error deleting profile:", error.message);
      }
      return false;
    }
  }
}

export const profileService = new ProfileService();