import axios from "axios";

// Get all schools
const getAllSchools = async () => {
  try {
    const response = await axios.get(`/api/`);
    return response?.data;
  } catch (error) {
    console.error(error)
    return []
  }
};

// Get schools by zone
const getSchoolsByZone = async (zone: string) => {
  try {
    const response = await axios.get(`/api/schools/getByZone/${zone}`);
    return response?.data;
  } catch (error) {
    console.error(error)
    return []
  }
};

// Get schools by division
const getSchoolsByDivision = async (division: string) => {
  try {
    const response = await axios.get(`/api/schools/getByDivision/${division}`);
    return response?.data;
  } catch (error) {
    console.error(error)
    return []
  }
};

// Get schools by province
const getSchoolsByProvince = async (province: string) => {
  try {
    const response = await axios.get(`/api/schools/getByProvince/${province}`);
    return response?.data;
  } catch (error) {
    console.error(error)
    return []
  }
};

export { getAllSchools, getSchoolsByDivision, getSchoolsByZone, getSchoolsByProvince }
