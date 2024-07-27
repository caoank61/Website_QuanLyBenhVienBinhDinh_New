import axiosClient from './axiosClient';

const prescriptionAPI = {
  // Thêm đơn thuốc mới
  async addPrescription(data) {
    try {
      const response = await axiosClient.post('/prescriptions', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin đơn thuốc
  async updatePrescription(data, id) {
    try {
      const response = await axiosClient.put(`/prescriptions/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xóa đơn thuốc
  async deletePrescription(id) {
    try {
      const response = await axiosClient.delete(`/prescriptions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin đơn thuốc theo ID
  async getPrescriptionById(id) {
    try {
      const response = await axiosClient.get(`/prescriptions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả đơn thuốc
  async getAllPrescriptions() {
    try {
      const response = await axiosClient.get('/prescriptions');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm đơn thuốc
  async searchPrescriptions(keyword) {
    try {
      const response = await axiosClient.get('/prescriptions/search', { params: { keyword } });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default prescriptionAPI;
