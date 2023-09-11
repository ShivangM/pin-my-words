import { BoardAccess } from '@/interfaces/Board.d';
import { Word } from '@/interfaces/Word.d';
import useBoardStore from '@/store/boardStore';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BiSolidEdit } from 'react-icons/bi';
import { HiMiniSpeakerWave } from 'react-icons/hi2';

const WordsCard = ({ word, idx }: { word: Word; idx: number }) => {
  const [openDeleteWordModal, openEditWordModal, userAccess] = useBoardStore((state) => [
    state.openDeleteWordModal,
    state.openEditWordModal,
    state.userAccess
  ]);

  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(word.word);

    setUtterance(u);
    setSynth(synth);

    return () => {
      synth.cancel();
    };
  }, [word]);

  return (
    <div
      className={classNames(
        'flex flex-col overflow-hidden bg-gray-100 rounded-md shadow-sm',
        idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      )}
    >
      <div className="relative h-80 aspect-square">
        <Image
          src={word.image || '/assets/board-placeholder.svg'}
          alt={word.word}
          fill
          objectFit="cover"
        />
      </div>

      <div className="flex flex-col relative justify-center space-y-6 flex-1 p-6">
        {
          userAccess === BoardAccess.READ_ONLY ? null
            :
            <div className="w-fit flex items-center space-x-2 absolute top-4 right-4">
              <BiSolidEdit
                onClick={() => openEditWordModal(word)}
                className="w-6 h-6 cursor-pointer text-gray-700"
              />
              <AiFillDelete
                onClick={() => openDeleteWordModal(word)}
                className="w-6 h-6 cursor-pointer text-red-500"
              />
            </div>
        }

        <div className="">
          <span className="text-xs uppercase">{word.partOfSpeech?.join(", ")}</span>
          <h3 className="text-3xl font-bold space-x-2">
            <span>{word.word}</span>
            <HiMiniSpeakerWave onClick={() => synth?.speak(utterance!)} className='inline text-gray-400 cursor-pointer' />
          </h3>
          <p className="">{word.meaning}</p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold">Root Word(s): </h4>
          <ul className="space-x-2 text-sm text-gray-900 font-medium cursor-pointer list-inside list-none flex items-center">
            {word.roots?.map((root) => (
              <li key={root.value} className="px-2 py-0.5 transition-all ease-in-out duration-300 bg-gray-200 hover:bg-gray-300 rounded-lg">
                {root.label}
              </li>
            ))
            }
          </ul>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold">Examples: </h4>
          <ol className="space-y-1 text-sm text-gray-500 list-inside list-decimal">
            {word.examples.length > 0 ? word.examples.map((example, idx) => (
              <li key={idx} className="space-x-1">
                {example.split(' ').map((w, idx) => (
                  <span
                    key={idx}
                    className={classNames(
                      'inline-block',
                      w.toLowerCase().match(word.word.toLowerCase()) ? 'font-bold text-black' : ''
                    )}
                  >
                    {w}
                  </span>
                ))}
              </li>
            ))
              : <div className="">No Examples Provided.</div>
            }
          </ol>
        </div>

        <button
          type="button"
          className="modalBtn bg-slate-200 hover:bg-slate-300 w-fit"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default WordsCard;
