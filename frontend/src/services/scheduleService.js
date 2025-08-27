const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ScheduleService {
  async createSchedule(scheduleData) {
    try {
      // LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:mm:ss)
      const formatForBackend = (dateTimeLocal) => {
        if (!dateTimeLocal) return null;
        // datetime-local 형식을 LocalDateTime 형식으로 변환
        return dateTimeLocal.includes('T') ? dateTimeLocal + ':00' : dateTimeLocal;
      };

      const payload = {
        ...scheduleData,
        startTime: formatForBackend(scheduleData.startTime),
        endTime: formatForBackend(scheduleData.endTime)
      };

      console.log('Sending to backend:', payload);

      const response = await fetch(`${API_BASE_URL}/api/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      return result;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  async getAllSchedules() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  }

  async getTodaySchedules() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/today`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching today schedules:', error);
      throw error;
    }
  }

  async getThisWeekSchedules() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/this-week`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching this week schedules:', error);
      throw error;
    }
  }

  async deleteSchedule(scheduleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/${scheduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }
}

export default new ScheduleService();
