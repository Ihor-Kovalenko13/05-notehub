import { useState, useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import type { fetchNotesResponse } from '../../services/noteService';
import { fetchNotes } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import useModalControl from '../../hook/useModalControl';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { isModalOpen, openModal, closeModal } = useModalControl();

  const { data, isError, isLoading, isSuccess, isFetching } =
    useQuery<fetchNotesResponse>({
      queryKey: ['notes', page, search],
      queryFn: () => fetchNotes({ page, search }),
      enabled: page !== 0,
      placeholderData: keepPreviousData,
    });

  const totalPages = data?.totalPages ?? 0;
  // console.log(totalPages, page);

  useEffect(() => {
    if (data?.notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [data?.notes.length]);

  const hendleSearch = useDebouncedCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  },
  300
);


  return (
    <>
      <Toaster />
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={hendleSearch} search={search} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={setPage}
            />
          )}

          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        {isLoading || (isFetching && <Loader />)}
        {isError && <Error />}
        {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onSuccessClose={closeModal} />
          </Modal>
        )}
      </div>
    </>
  );
}

//  App;