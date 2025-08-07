export const getBaseUrl = async () => {
  const realBackend = import.meta.env.VITE_API_BASE_URL;
  const mockBackend = import.meta.env.VITE_MOCK_API_URL;

  try {
    const res = await fetch(`${realBackend}/api/ping`);
    if (!res.ok) throw new Error('Backend responded but not OK');
    return realBackend;
  } catch (error) {
    console.warn('⚠️ Backend not available, using MockAPI');
    return mockBackend;
  }
};
