import { toast } from 'react-toastify';

class UserService {
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
          { field: { Name: "question_responses" } },
          { field: { Name: "interests" } },
          { field: { Name: "created_at" } },
          { field: { Name: "is_active" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('app_User', params);
      
      if (!response.success) {
        console.error("Error fetching users:", response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching users:", error?.response?.data?.message);
      } else {
        console.error("Error fetching users:", error.message);
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
          { field: { Name: "question_responses" } },
          { field: { Name: "interests" } },
          { field: { Name: "created_at" } },
          { field: { Name: "is_active" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('app_User', id, params);
      
      if (!response.success) {
        console.error("Error fetching user:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching user with ID ${id}:`, error.message);
      }
      return null;
    }
  }
  
  async getCurrentUser() {
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
          { field: { Name: "question_responses" } },
          { field: { Name: "interests" } },
          { field: { Name: "created_at" } },
          { field: { Name: "is_active" } }
        ],
        where: [
          {
            FieldName: "is_active",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('app_User', params);
      
      if (!response.success) {
        console.error("Error fetching current user:", response.message);
        return null;
      }
      
      if (!response.data || response.data.length === 0) {
        return null;
      }
      
      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching current user:", error?.response?.data?.message);
      } else {
        console.error("Error fetching current user:", error.message);
      }
      return null;
    }
  }
  
  async createProfile(profileData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: profileData.name,
            age: parseInt(profileData.age),
            location: profileData.location,
            photo: profileData.photo,
            bio: profileData.bio,
            mbti_type: profileData.mbtiType,
            love_languages: profileData.loveLanguages.join(','),
            question_responses: JSON.stringify(profileData.questionResponses || []),
            interests: profileData.interests ? profileData.interests.join(',') : '',
            created_at: new Date().toISOString(),
            is_active: true
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('app_User', params);
      
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
  
  async updateProfile(id, data) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.age !== undefined) updateData.age = parseInt(data.age);
      if (data.location !== undefined) updateData.location = data.location;
      if (data.photo !== undefined) updateData.photo = data.photo;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.mbti_type !== undefined) updateData.mbti_type = data.mbti_type;
      if (data.love_languages !== undefined) updateData.love_languages = Array.isArray(data.love_languages) ? data.love_languages.join(',') : data.love_languages;
      if (data.question_responses !== undefined) updateData.question_responses = typeof data.question_responses === 'string' ? data.question_responses : JSON.stringify(data.question_responses);
      if (data.interests !== undefined) updateData.interests = Array.isArray(data.interests) ? data.interests.join(',') : data.interests;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('app_User', params);
      
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
      
      const response = await this.apperClient.deleteRecord('app_User', params);
      
      if (!response.success) {
        console.error("Error deleting user:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete user ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('User deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting user:", error?.response?.data?.message);
      } else {
        console.error("Error deleting user:", error.message);
      }
      return false;
    }
  }
}

export const userService = new UserService();