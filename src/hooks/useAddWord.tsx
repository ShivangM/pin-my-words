import { useState } from 'react';
import { AddWordSteps, Word } from '@/interfaces/Word';
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {};

const useAddWord = () => {
  const { register, handleSubmit, control, formState } = useForm<Word>();
  const [addWordStep, setAddWordStep] = useState(AddWordSteps.ENTER_DETAILS);

  const onSubmit: SubmitHandler<Word> = (data) => console.log(data);

  return { register, handleSubmit, control, formState, onSubmit, addWordStep };
};

export default useAddWord;
