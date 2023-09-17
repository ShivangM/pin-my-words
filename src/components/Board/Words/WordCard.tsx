import { BoardAccess } from '@/interfaces/Board.d';
import { Word } from '@/interfaces/Word.d';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import classNames from 'classnames';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BiSolidEdit } from 'react-icons/bi';
import { HiMiniSpeakerWave } from 'react-icons/hi2';
import { toast } from 'react-toastify';

const WordsCard = ({ word, idx }: { word: Word; idx: number }) => {
  const [userAccess, fetchRootWord] = useBoardStore((state) => [
    state.userAccess,
    state.fetchRootWord,
  ]);

  const [
    toggleViewWordModal,
    toggleViewRootWordModal,
    toggleEditWordModal,
    toggleDeleteWordModal,
  ] = useUIStore((state) => [
    state.toggleViewWordModal,
    state.toggleViewRootWordModal,
    state.toggleEditWordModal,
    state.toggleDeleteWordModal,
  ]);

  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );
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

  const [userData] = useUserStore((state) => [state.userData]);

  const handleViewRootWord = async (rootWordId: string) => {
    let rootWord = null;

    toast.loading('Loading root word...', {
      toastId: 'loading-root-word',
    });

    try {
      rootWord = await fetchRootWord(rootWordId, userData?.uid!);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.dismiss('loading-root-word');
    }

    toggleViewRootWordModal(rootWord);
  };

  return (
    <div
      className={classNames(
        'flex flex-col overflow-hidden bg-gray-100 rounded-md shadow-sm',
        idx % 2 === 0 ? 'xl:flex-row' : 'xl:flex-row-reverse'
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
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-500">Last Updated:</span>{' '}
            {moment(word.updatedAt.toDate()).fromNow()}
          </p>
          {userAccess === BoardAccess.READ_ONLY ? null : (
            <div className="w-fit flex items-center space-x-2">
              <BiSolidEdit
                onClick={() => toggleEditWordModal(word)}
                className="w-6 h-6 cursor-pointer text-gray-700"
              />
              <AiFillDelete
                onClick={() => toggleDeleteWordModal(word)}
                className="w-6 h-6 cursor-pointer text-red-500"
              />
            </div>
          )}
        </div>

        <div className="">
          <span className="text-xs uppercase">
            {word.partOfSpeech?.join(', ')}
          </span>
          <h3 className="text-3xl font-bold space-x-2">
            <span>{word.word}</span>
            <HiMiniSpeakerWave
              onClick={() => synth?.speak(utterance!)}
              className="inline text-gray-400 cursor-pointer"
            />
          </h3>
          <p className="">{word.meaning}</p>
        </div>

        <div className="space-y-1 w-full">
          <h4 className="text-sm font-bold">Root Word(s): </h4>
          <ul className="space-x-2 overflow-x-auto text-sm text-gray-900 font-medium cursor-pointer list-inside list-none flex items-center">
            {word.roots && word.roots.length > 0 ? (
              word.roots.map((root) => (
                <li
                  key={root.value}
                  onClick={() => handleViewRootWord(root.value)}
                  className="px-2 py-0.5 transition-all ease-in-out duration-300 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  {root.label}
                </li>
              ))
            ) : (
              <div className="text-gray-500">No Root Word(s) Provided.</div>
            )}
          </ul>
        </div>

        <button
          type="button"
          className="modalBtn bg-slate-200 hover:bg-slate-300 w-fit"
          onClick={() => toggleViewWordModal(word)}
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default WordsCard;
