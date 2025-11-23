import axios from 'axios';
import type { Note } from '../types/note';

interface fetchNotesProps {
  search: string;
  page: number;
}

export interface fetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface createNoteProps {
  title: string;
  content: string;
  tag: string;
}

const myToken = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${myToken}`;

export const fetchNotes = async ({
  search,
  page,
}: fetchNotesProps): Promise<fetchNotesResponse> => {
  const options = {
    params: {
      page,
      perPage: 12,
      search,
    },
  };

  const response = await axios
    .get<fetchNotesResponse>('/notes', options)
    .then(response => response.data);

  return response;
};

export const createNote = async (data: createNoteProps): Promise<Note> => {
  const response = await axios.post<Note>('/notes', data);
  return response.data;
};

export const deleteNote = async (id: Note['id']): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};
