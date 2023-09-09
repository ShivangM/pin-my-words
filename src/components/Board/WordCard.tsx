import { Word } from '@/interfaces/Word.d';
import classNames from 'classnames';
import Image from 'next/image';
import { HiMiniSpeakerWave } from 'react-icons/hi2';

const WordsCard = ({ word, idx }: { word: Word; idx: number }) => {
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

      <div className="flex flex-col justify-center space-y-6 flex-1 p-6">
        <div className="">
          <span className="text-xs uppercase">{word.partOfSpeech?.join(", ")}</span>
          <h3 className="text-3xl font-bold space-x-2">
            <span>{word.word}</span>
            <HiMiniSpeakerWave className='inline text-gray-400 cursor-pointer' />
            </h3>
          <p className="">{word.meaning}</p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold">Examples: </h4>
          <ol className="space-y-1 list-inside list-decimal">
            {word.examples?.map((example, idx) => (
              <li key={idx} className="text-sm text-gray-500 space-x-1">
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
            ))}
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
