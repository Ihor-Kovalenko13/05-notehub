export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
}

export interface NoteTag {
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}