import useAddWord from '@/hooks/useAddWord';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select/dist/declarations/src/Select';
import options from '@/constants/parts-of-speech.json';

type Props = {};

const EnterDetails = (props: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = useAddWord();

  return (
    <div>
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Word
        </label>
        <input
          className={classNames(
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
            errors?.word ? 'border-red-500' : null
          )}
          type="text"
          placeholder="Word"
          {...register('word', {
            required: 'Word is required.',
          })}
        />
        <ErrorMessage
          errors={errors}
          name="word"
          render={({ message }) => (
            <p className="text-red-500 text-xs italic">{message}</p>
          )}
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Meaning
        </label>
        <input
          className={classNames(
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
            errors?.word ? 'border-red-500' : null
          )}
          type="text"
          placeholder="Word"
          {...register('meaning', {
            required: 'Meaning is required.',
          })}
        />
        <ErrorMessage
          errors={errors}
          name="meaning"
          render={({ message }) => (
            <p className="text-red-500 text-xs italic">{message}</p>
          )}
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Parts Of Speech
        </label>
        <Controller
          control={control}
          name="partOfSpeech"
          rules={{ required: 'Parts of speech is required.' }}
          defaultValue={['Noun']}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              //@ts-ignore
              inputRef={ref}
              value={options.filter((c) => value.includes(c.value))}
              onChange={(val) => onChange(val.map((c) => c.value))}
              isMulti={true}
              options={options}
            />
          )}
        />

        <ErrorMessage
          errors={errors}
          name="partOfSpeech"
          render={({ message }) => (
            <p className="text-red-500 text-xs italic">{message}</p>
          )}
        />
      </div>
    </div>
  );
};

export default EnterDetails;
