import axios from "axios";

const getSchoolsByProvince = async (province: string) => {
    try {
        const response = await axios.get(`/api/schools/getByProvince/${province}`);
        return response?.data;
    } catch (error) {
        console.error(error)
        return []
    }
};

export { getSchoolsByProvince };