import axiosClient from './axiosClient';

const drugAPI = {
  async addDrug(data) {
    try {
      const response = await axiosClient.post('/drugs/add', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateDrug(data, id) {
    try {
      const response = await axiosClient.put(`/drugs/update/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteDrug(id) {
    try {
      const response = await axiosClient.delete(`/drugs/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getDrugById(id) {
    try {
      const response = await axiosClient.get(`/drugs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getAllDrugs() {
    try {
      const response = await axiosClient.get('/drugs');
      return response;
    } catch (error) {
      throw error;
    }
  },
  async searchDrugs(keyword) {
    try {
      const response = await axiosClient.get('/drugs/search', { params: { keyword } });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default drugAPI;
