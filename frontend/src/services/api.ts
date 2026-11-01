const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code = 'REQUEST_FAILED', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === false)) {
      const errorMessage =
        data?.error?.message || response.statusText || 'An unexpected error occurred.';
      const errorCode = data?.error?.code || `HTTP_${response.status}`;
      throw new ApiError(errorMessage, errorCode, data?.error?.details);
    }

    return (data?.data !== undefined ? data.data : data) as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network communication failure');
  }
}

export const api = {
  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request<any>('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request<{ user: any }>('/auth/me'),

  // Cases
  createCase: (body: any) => request<any>('/cases', { method: 'POST', body: JSON.stringify(body) }),
  getCases: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<any>(`/cases${qs}`);
  },
  getCase: (caseId: string) => request<any>(`/cases/${caseId}`),
  deleteCase: (caseId: string) => request<any>(`/cases/${caseId}`, { method: 'DELETE' }),

  // Evidence
  getEvidenceList: (caseId: string, category?: string) => {
    const qs = category && category !== 'ALL' ? `?category=${category}` : '';
    return request<any[]>(`/cases/${caseId}/evidence${qs}`);
  },
  getEvidenceDetail: (caseId: string, evidenceId: string) =>
    request<any>(`/cases/${caseId}/evidence/${evidenceId}`),

  // Accusation & Reveal
  submitAccusation: (caseId: string, suspectId: string) =>
    request<any>(`/cases/${caseId}/accusation`, {
      method: 'POST',
      body: JSON.stringify({ suspectId }),
    }),
  getCaseResult: (caseId: string) => request<any>(`/cases/${caseId}/result`),

  // Player Notes
  getNotes: (caseId: string) => request<{ content: string }>(`/cases/${caseId}/notes`),
  updateNotes: (caseId: string, content: string) =>
    request<{ content: string }>(`/cases/${caseId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
};
