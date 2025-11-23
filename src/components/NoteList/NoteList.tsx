import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';

interface NotelistProps {
  notes: Note[];
}

export default function NoteList({ notes }: NotelistProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDeleteNote = (id: string) => {
    mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map(note => {
        return (
          <li className={css.listItem} key={note.id}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button
                type="button"
                onClick={() => handleDeleteNote(note.id)}
                className={css.button}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}