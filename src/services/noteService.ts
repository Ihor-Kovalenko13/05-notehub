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
    .get('/notes', options)
    .then(response => response.data);

  // console.log('API response →', response);
  return response;
};

export const createNote = async (data: createNoteProps) => {
  const response = await axios.post<Note>('/notes', data, {});
  // console.log(response.data);

  return response.data;
};

export const deleteNote = async (id: Note['id']) => {
  await axios.delete(`/notes/${id}`);
};