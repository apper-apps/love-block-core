import { toast } from 'react-toastify';

class SimulationService {
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
          { field: { Name: "participants" } },
          { field: { Name: "question_sequence" } },
          { field: { Name: "responses" } },
          { field: { Name: "completion_rate" } },
          { field: { Name: "insights" } },
          { field: { Name: "started_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('simulation', params);
      
      if (!response.success) {
        console.error("Error fetching simulations:", response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching simulations:", error?.response?.data?.message);
      } else {
        console.error("Error fetching simulations:", error.message);
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
          { field: { Name: "participants" } },
          { field: { Name: "question_sequence" } },
          { field: { Name: "responses" } },
          { field: { Name: "completion_rate" } },
          { field: { Name: "insights" } },
          { field: { Name: "started_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('simulation', id, params);
      
      if (!response.success) {
        console.error("Error fetching simulation:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching simulation with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching simulation with ID ${id}:`, error.message);
      }
      return null;
    }
  }
  
  async getActive() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "participants" } },
          { field: { Name: "question_sequence" } },
          { field: { Name: "responses" } },
          { field: { Name: "completion_rate" } },
          { field: { Name: "insights" } },
          { field: { Name: "started_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["active"]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('simulation', params);
      
      if (!response.success) {
        console.error("Error fetching active simulation:", response.message);
        return null;
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error("No active simulation found");
      }
      
      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching active simulation:", error?.response?.data?.message);
      } else {
        console.error("Error fetching active simulation:", error.message);
      }
      throw error;
    }
  }
  
  async create(simulation) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: simulation.name || `Simulation ${Date.now()}`,
            participants: Array.isArray(simulation.participants) ? simulation.participants.join(',') : simulation.participants,
            question_sequence: simulation.questionSequence || simulation.question_sequence || '1,2,3,4,5',
            responses: typeof simulation.responses === 'string' ? simulation.responses : JSON.stringify(simulation.responses || []),
            completion_rate: simulation.completionRate || simulation.completion_rate || 0,
            insights: typeof simulation.insights === 'string' ? simulation.insights : JSON.stringify(simulation.insights || {}),
            started_at: simulation.startedAt || simulation.started_at || new Date().toISOString(),
            completed_at: simulation.completedAt || simulation.completed_at || null,
            status: simulation.status || 'active'
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('simulation', params);
      
      if (!response.success) {
        console.error("Error creating simulation:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create simulation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Simulation created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating simulation:", error?.response?.data?.message);
      } else {
        console.error("Error creating simulation:", error.message);
      }
      return null;
    }
  }
  
  async addResponse(id, response) {
    try {
      const simulation = await this.getById(id);
      if (!simulation) {
        throw new Error("Simulation not found");
      }
      
      let currentResponses = [];
      try {
        currentResponses = typeof simulation.responses === 'string' ? JSON.parse(simulation.responses) : simulation.responses || [];
      } catch (e) {
        currentResponses = [];
      }
      
      currentResponses.push(response);
      
      const questionSequence = simulation.question_sequence ? simulation.question_sequence.split(',').length : 5;
      const newCompletionRate = (currentResponses.length / questionSequence) * 100;
      
      return await this.update(id, {
        responses: JSON.stringify(currentResponses),
        completion_rate: newCompletionRate
      });
    } catch (error) {
      console.error("Error adding response:", error.message);
      throw error;
    }
  }
  
  async complete(id, responses) {
    try {
      return await this.update(id, {
        responses: JSON.stringify(responses),
        completion_rate: 100,
        status: 'completed',
        completed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error completing simulation:", error.message);
      throw error;
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
      if (data.participants !== undefined) updateData.participants = Array.isArray(data.participants) ? data.participants.join(',') : data.participants;
      if (data.question_sequence !== undefined || data.questionSequence !== undefined) updateData.question_sequence = data.question_sequence || data.questionSequence;
      if (data.responses !== undefined) updateData.responses = typeof data.responses === 'string' ? data.responses : JSON.stringify(data.responses);
      if (data.completion_rate !== undefined || data.completionRate !== undefined) updateData.completion_rate = data.completion_rate || data.completionRate;
      if (data.insights !== undefined) updateData.insights = typeof data.insights === 'string' ? data.insights : JSON.stringify(data.insights);
      if (data.started_at !== undefined || data.startedAt !== undefined) updateData.started_at = data.started_at || data.startedAt;
      if (data.completed_at !== undefined || data.completedAt !== undefined) updateData.completed_at = data.completed_at || data.completedAt;
      if (data.status !== undefined) updateData.status = data.status;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('simulation', params);
      
      if (!response.success) {
        console.error("Error updating simulation:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update simulation ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Simulation updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating simulation:", error?.response?.data?.message);
      } else {
        console.error("Error updating simulation:", error.message);
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
      
      const response = await this.apperClient.deleteRecord('simulation', params);
      
      if (!response.success) {
        console.error("Error deleting simulation:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete simulation ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Simulation deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting simulation:", error?.response?.data?.message);
      } else {
        console.error("Error deleting simulation:", error.message);
      }
      return false;
    }
  }
}

export const simulationService = new SimulationService();