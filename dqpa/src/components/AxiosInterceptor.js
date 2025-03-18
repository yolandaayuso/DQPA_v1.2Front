import useAxiosInterceptor from '../hooks/useAxiosInterceptor';

const AxiosInterceptor = () => {
  useAxiosInterceptor();
  return null; // No renderiza nada, solo activa el interceptor
};

export default AxiosInterceptor;
