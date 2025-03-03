import axios, { AxiosInstance } from "axios";
import { createClient } from '@/utils/supabase/server';

const ServerAPI: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY || 'https://app.sagebridge.in',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
ServerAPI.interceptors.request.use(async (config) => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const { data: tokenData, error } = await supabase
        .from('gateway_tokens')
        .select('access_token')
        .eq('user_id', user.id)
        .single();
       console.log(tokenData)
      if (tokenData?.access_token && !error) {
        config.headers.Authorization = `Bearer ${tokenData.access_token}`;
      }
    }
    return config;
  } catch (error) {
    console.error('Error setting auth header:', error);
    return config;
  }
});
ServerAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios request failed:', error.message);
    return Promise.reject(error);
  }
);

export default ServerAPI;

