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

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { isModalOpen, openModal, closeModal } = useModalControl();


  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); 
  }, 300);

  const { data, isError, isLoading, isSuccess, isFetching } =
    useQuery<fetchNotesResponse>({
      queryKey: ['notes', page, search],
      queryFn: () => fetchNotes({ page, search }),
      placeholderData: keepPreviousData,
    });

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (data?.notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [data?.notes.length]);


  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);   
    handleSearch(value);      
  };

  return (
    <>
      <Toaster />
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox
            onChange={onInputChange}
            search={searchInput} 
          />

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