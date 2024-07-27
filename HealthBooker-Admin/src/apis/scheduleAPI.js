import axiosClient from './axiosClient';

const scheduleAPI = {
  async addSchedule(data) {
    try {
      const response = await axiosClient.post('/schedules/add', data);
      return response; 
    } catch (error) {
      throw error;
    }
  },

  async updateSchedule(id, data) {
    try {
      const response = await axiosClient.put(`/schedules/update/${id}`, data);
      return response; 
    } catch (error) {
      throw error;
    }
  },

  async deleteSchedule(id) {
    try {
      const response = await axiosClient.delete(`/schedules/delete/${id}`);
      return response; 
    } catch (error) {
      throw error;
    }
  },

  async getScheduleById(id) {
    try {
      const response = await axiosClient.get(`/schedules/${id}`);
      return response; 
    } catch (error) {
      throw error;
    }
  },

  async getAllSchedules() {
    try {
      const response = await axiosClient.get('/schedules/all');
      return response; 
    } catch (error) {
      throw error;
    }
  },

  async searchSchedules(keyword) {
    try {
      const response = await axiosClient.get('/schedules/search', { params: { keyword } });
      return response; 
    } catch (error) {
      throw error;
    }
  }
};

export default scheduleAPI;
