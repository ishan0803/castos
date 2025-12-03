import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Project } from '../api/types';

export function useProject(id: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/projects/${id}`);
        setProject(res.data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.detail || 'Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
}