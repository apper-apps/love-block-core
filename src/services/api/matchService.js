import { toast } from 'react-toastify';

class MatchService {
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
          { field: { Name: "mbti_type" } },
          { field: { Name: "love_languages" } },
          { field: { Name: "compatibility_score" } },
          { field: { Name: "matched_on" } },
          { field: { Name: "last_message" } },
          { field: { Name: "is_online" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('match', params);
      
      if (!response.success) {
        console.error("Error fetching matches:", response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching matches:", error?.response?.data?.message);
      } else {
        console.error("Error fetching matches:", error.message);
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
          { field: { Name: "mbti_type" } },
          { field: { Name: "love_languages" } },
          { field: { Name: "compatibility_score" } },
          { field: { Name: "matched_on" } },
          { field: { Name: "last_message" } },
          { field: { Name: "is_online" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('match', id, params);
      
      if (!response.success) {
        console.error("Error fetching match:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching match with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching match with ID ${id}:`, error.message);
      }
      return null;
    }
  }
  
  async create(match) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: match.name || match.Name,
            age: parseInt(match.age),
            location: match.location,
            photo: match.photo,
            mbti_type: match.mbtiType || match.mbti_type,
            love_languages: Array.isArray(match.loveLanguages) ? match.loveLanguages.join(',') : match.love_languages,
            compatibility_score: match.compatibilityScore || match.compatibility_score || Math.floor(Math.random() * 30) + 70,
            matched_on: match.matchedOn || match.matched_on || new Date().toISOString(),
            last_message: match.lastMessage || match.last_message || '',
            is_online: match.isOnline !== undefined ? match.isOnline : match.is_online !== undefined ? match.is_online : Math.random() > 0.5
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('match', params);
      
      if (!response.success) {
        console.error("Error creating match:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create match ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Match created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating match:", error?.response?.data?.message);
      } else {
        console.error("Error creating match:", error.message);
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
      if (data.mbti_type !== undefined || data.mbtiType !== undefined) updateData.mbti_type = data.mbti_type || data.mbtiType;
      if (data.love_languages !== undefined || data.loveLanguages !== undefined) {
        const loveLanguages = data.love_languages || data.loveLanguages;
        updateData.love_languages = Array.isArray(loveLanguages) ? loveLanguages.join(',') : loveLanguages;
      }
      if (data.compatibility_score !== undefined || data.compatibilityScore !== undefined) updateData.compatibility_score = data.compatibility_score || data.compatibilityScore;
      if (data.matched_on !== undefined || data.matchedOn !== undefined) updateData.matched_on = data.matched_on || data.matchedOn;
      if (data.last_message !== undefined || data.lastMessage !== undefined) updateData.last_message = data.last_message || data.lastMessage;
      if (data.is_online !== undefined || data.isOnline !== undefined) updateData.is_online = data.is_online !== undefined ? data.is_online : data.isOnline;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('match', params);
      
      if (!response.success) {
        console.error("Error updating match:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update match ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Match updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating match:", error?.response?.data?.message);
      } else {
        console.error("Error updating match:", error.message);
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
      
      const response = await this.apperClient.deleteRecord('match', params);
      
      if (!response.success) {
        console.error("Error deleting match:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete match ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Match deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting match:", error?.response?.data?.message);
      } else {
        console.error("Error deleting match:", error.message);
      }
      return false;
    }
  }
}

export const matchService = new MatchService();